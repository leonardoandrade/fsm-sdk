/**
 * EXAMPLE
 * Query activities by subject, dump data and requirements
 */

const fsm = require('../release');
const client = new fsm.CoreAPIClient({

  // debug: true,

  // put your client config here
  clientIdentifier: process.env.CLIENT_IDENTIFIER,
  clientSecret: process.env.CLIENT_SECRET,
  clientVersion: process.env.CLIENT_VERSION,

  // put your auth config here
  authAccountName: process.env.AUTH_ACCOUNTNAME,
  authUserName: process.env.AUTH_USERNAME,
  authPassword: process.env.AUTH_PASSWORD

});


// replace this with the ID of the activity 
const activityId = '27A56B29AD204CA4AAC378038734E83E';

(async () => {

  // first, get the activity and it's attributes
  const activityResponse = await client.getById('Activity', activityId);

  if (!activityResponse || !activityResponse.data || activityResponse.data.length === 0) {
    console.log('Activity not found');
    return;
  }

  const activity = activityResponse.data[0].activity;

  // then, get the address related to the activity
  const addressResponse = activity.address ? await client.getById('Address', activity.address) : null;
  const address = addressResponse && addressResponse.data && addressResponse.data.length != 0 ? addressResponse.data[0].address : null;

  // get the activity requirements, which are in another two entities: requirements and tags
  // since multiple records are needed, we use the query API
  const queryRequirements =
    `SELECT
        requirement.mandatory,
        tag.name
       FROM
        Tag tag,
        Requirement requirement
       WHERE
        requirement.object.objectId = '${activity.id}' AND
        requirement.tag = tag.id
      `;
  const resultRequirements = await client.query(queryRequirements, ['Requirement', 'Tag']);

  const mandatoryRequirements = resultRequirements && resultRequirements.data ? resultRequirements.data.filter(el => el.requirement.mandatory).map(el => el.tag.name) : [];
  const optionalRequirements = resultRequirements && resultRequirements.data ? resultRequirements.data.filter(el => !el.requirement.mandatory).map(el => el.tag.name) : [];

  console.log('\nACTIVITY:');
  console.log(`subject: '${activity.subject}' earliest start: '${activity.earliestStartDateTime}' due: '${activity.dueDateTime}'`);
  if (address && address.location) {
    console.log(`location: (${address.location.latitude}, ${address.location.longitude})`);
  }
  console.log(`mandatory: [${mandatoryRequirements.join(', ')}] optional: [${optionalRequirements.join(', ')}]`);


})();
