import TaskQueries from "./queries/tasks";

const GenerateLink = async client => {
  let r = await client.query({
    query: TaskQueries.generateStripeConnectDashboardLink
  });

  return r;
};

export default GenerateLink;
