import React from "react";
import { useFeature } from "flagged";
import { useHistory, useLocation } from "react-router-dom";
import { useQuery } from "react-query";
import { Button, Breadcrumb, BreadcrumbItem, Link } from "@carbon/react";
import {
  FeatureHeader as Header,
  FeatureHeaderTitle as HeaderTitle,
  FeatureHeaderSubtitle as HeaderSubtitle,
} from "@boomerang-io/carbon-addons-boomerang-react";
import queryString from "query-string";
import IntegrationCard from "Components/IntegrationCard";
import { useTeamContext, useAppContext } from "Hooks";
import { appLink } from "Config/appConfig";
import { serviceUrl, resolver } from "Config/servicesConfig";
import { FlowTeam } from "Types";
import styles from "./integrations.module.scss";

export default function Integrations() {
  const { name } = useAppContext();
  const { team } = useTeamContext();
  const history = useHistory();
  const location = useLocation();

  //TODO move the query to the backend
  const getIntegrationsUrl = serviceUrl.getIntegrations({ query: `teams=${team?.name}` });
  // const integrationsQuery = useQuery<PaginatedWorkflowResponse, string>({
  //   queryKey: getIntegrationsUrl,
  //   queryFn: resolver.query(getIntegrationsUrl),
  // });

  // TODO: make this smarter bc we shouldn't get to the route without an active team
  if (!team) {
    return history.push(appLink.home());
  }

  const { query: searchQuery = "" } = queryString.parse(location.search, {
    arrayFormat: "comma",
  });

  const handleUpdateFilter = (args: { query: string }) => {
    const queryStr = `?${queryString.stringify(args, { arrayFormat: "comma", skipEmptyString: true })}`;
    history.push({ search: queryStr });
  };

  let safeSearchQuery = "";
  if (Array.isArray(searchQuery)) {
    safeSearchQuery = searchQuery.join().toLowerCase();
  } else if (searchQuery) {
    safeSearchQuery = searchQuery.toLowerCase();
  }

  // if (integrationsQuery.isLoading) {
  //   return (
  //     <Layout team={team} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery} workflowList={[]}>
  //       <IntegrationCardSkeleton />
  //     </Layout>
  //   );
  // }

  // if (integrationsQuery.error) {
  //   return (
  //     <Layout team={team} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery} workflowList={[]}>
  //       <Error />
  //     </Layout>
  //   );
  // }

  const integrationTemplates = [
    {
      id: "1",
      name: "Slack",
      description: "Send a message to Slack",
      icon: "https://previews.us-east-1.widencdn.net/preview/48045879/assets/asset-view/120e11d9-89e2-4f3a-8989-8e60478c762d/thumbnail/eyJ3IjoyMDQ4LCJoIjoyMDQ4LCJzY29wZSI6ImFwcCJ9?Expires=1697770800&Signature=dcJhphdI3EtfNnpExeqws5e3W3GvDqQDiSv-784Pc9uyamxq779lHRuR1itp7grJ1w7IS-qx5-qwEceXTQodlFFWINo0-g4Wu2YKpnDtNNIWr4GvArpmISRrJ70IPXMG9EARDw0XEVOdf550alNrJm5HhrGK4t5mJTNoRTLUM6duvxk~OY7Q1zXFFdqgo76L6qQjiANL26iarPU0BPWi1B2O~RcZ7TGBNFnVU2Xxfb3s29jomuON4~I2LEJTiQehtCX1Rer~gtXi8rGK-~LApmys~ybAROquKthuEXm1KN6lDR~JTq~wO5N9yfAoXmL8ZgARNLILsCXbt43Rykq6LQ__&Key-Pair-Id=APKAJM7FVRD2EPOYUXBQ",
      instructions: "",
      link: "",
      status: "inactive",
    },
    {
      id: "2",
      name: "GitHub",
      description: "Integrate with GitHub and receive events",
      icon: "https://vercel.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1QAkKuUQwpCKWozZN5GRph%2Fe2471e32b0dbc9fb74779d5909e939ad%2FFrame_4.png&w=3840&q=75&dpl=dpl_2LT6R8QY6etDhPFWrUq4QJcVhwAR",
      instructions: `To enable this integration, you will be asked to accept the GitHub App permissions and install into a particular GitHub organisation.\n\nOnce you have installed the app, you will be redirected back to ${name} to complete the integration.`,
      link: "https://github.com/apps/flowabl-io/installations/select_target",
      status: "active",
    },
  ];

  // if (integrationsQuery.data) {
  return (
    <Layout team={team} handleUpdateFilter={handleUpdateFilter} searchQuery={safeSearchQuery}>
      <div className={styles.workflows}>
        {integrationTemplates.map((template) => (
          <IntegrationCard key={template.id} teamName={team.name} data={template} url={getIntegrationsUrl} />
        ))}
      </div>
    </Layout>
  );
}
//   return null;
// }

interface LayoutProps {
  team: FlowTeam;
  children: React.ReactNode;
  handleUpdateFilter: (args: { query: string }) => void;
  searchQuery: string;
}

function Layout(props: LayoutProps) {
  const NavigationComponent = () => {
    return (
      <Breadcrumb noTrailingSlash>
        <BreadcrumbItem>
          <Link to={appLink.home()}>Home</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <p>{props.team.name}</p>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  };

  return (
    <div className={styles.container}>
      <Header
        className={styles.header}
        includeBorder={false}
        nav={<NavigationComponent />}
        header={
          <>
            <HeaderTitle>Integrations</HeaderTitle>
            <HeaderSubtitle>Extend your Workflows by using integrations for your favorite tools.</HeaderSubtitle>
          </>
        }
      />
      <div aria-label="My Integrations" className={styles.content} role="region" id="my-integrations">
        <section className={styles.sectionContainer}>{props.children}</section>
      </div>
    </div>
  );
}
