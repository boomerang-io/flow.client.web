import HomeBanner from "Components/HomeBanner";
import TeamCard from "Components/TeamCard";
import LearnCard from "Components/LearnCard";
import { Layer } from "@carbon/react";
import { Workflows, PlanningAnalytics, PlayerFlow, Gear } from "@carbon/pictograms-react";
import { useAppContext } from "Hooks";
import EmptyState from "Components/EmptyState";
import { FlowTeam } from "Types";
import styles from "./home.module.scss";

export default function Home() {
  const { teams, name } = useAppContext();
  return (
    <>
      <HomeBanner name={name} />
      <div aria-label="My Teams" className={styles.content} role="region">
        {teams && teams.length === 0 ? (
          //TODO - make better component for Create Team
          <EmptyState />
        ) : (
          <TeamContent teams={teams} />
        )}
      </div>
    </>
  );
}

interface TeamContentProps {
  teams: FlowTeam[];
}

const TeamContent: React.FC<TeamContentProps> = ({ teams }) => {
  return (
    <>
      <Section title="Your Teams" key="teams">
        <nav className={styles.sectionLinks}>
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </nav>
      </Section>
      <Layer>
        <Section title="Explore and Learn" key="learn">
          <nav className={styles.sectionLinks}>
            <LearnCard
              icon={<Workflows style={{ height: "1.5rem", width: "1.5rem" }} />}
              key="first-workflow"
              title="Create your first workflow"
              description="Dive into the world of automation and create your first Workflow with our drag-and-drop designer."
              link="https://useboomerang.io/docs"
              tags={["Getting started"]}
            />
            <LearnCard
              icon={<PlanningAnalytics style={{ height: "1.5rem", width: "1.5rem" }} />}
              key="activity"
              title="Explore Workflow activity"
              description="Gain control with execution activity and empower you to monitor, analyze, and optimize with precision and authority."
              link="https://useboomerang.io/docs"
              tags={["Getting started"]}
            />
            <LearnCard
              icon={<PlayerFlow style={{ height: "1.5rem", width: "1.5rem" }} />}
              key="actions"
              title="Your Action to-do list"
              description="Focus on the approvals and manual actions that do need the visibility or analysis of a human."
              link="https://useboomerang.io/docs"
              tags={["Next steps"]}
            />
            <LearnCard
              icon={<Gear style={{ height: "1.5rem", width: "1.5rem" }} />}
              key="manage"
              title="Manage your team"
              description="TBA."
              link="https://useboomerang.io/docs"
              tags={["Next steps"]}
            />
          </nav>
        </Section>
      </Layer>
    </>
  );
};

interface SectionProps {
  children: React.ReactNode;
  title: string;
}

const Section: React.FC<SectionProps> = ({ children, title }) => {
  return (
    <section className={styles.section}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {children}
    </section>
  );
};
