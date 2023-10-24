import HomeBanner from "Components/HomeBanner";
import TeamCard from "Components/TeamCard";
import LearnCard from "Components/LearnCard";
import cx from "classnames";
import { Layer } from "@carbon/react";
import { Workflows, PlanningAnalytics, PlayerFlow, Gear } from "@carbon/pictograms-react";
import { useAppContext } from "Hooks";
import TeamCardCreate from "Components/TeamCardCreate";
import styles from "./home.module.scss";

export default function Home() {
  const { teams, name, user } = useAppContext();
  return (
    <>
      <HomeBanner name={name} />
      <div className={styles.welcome}>
        <h1>Welcome, {user.name}</h1>
      </div>
      <div>
        <Layer>
          <Section title="Your Teams">
            <nav className={styles.sectionLinks}>
              {teams ? teams?.map((team) => <TeamCard key={team.name} team={team} />) : null}
              <TeamCardCreate teams={teams} />
            </nav>
          </Section>
        </Layer>
        <Section title="Explore and learn" hasBorder>
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
              description="Everything you need to manage your team effectively. Its members, workflows, approver groups, quotas, tokens, and more."
              link="https://useboomerang.io/docs"
              tags={["Next steps"]}
            />
          </nav>
        </Section>
      </div>
      <Section title="Key concepts" hasBorder>
        <nav className={styles.sectionLinks}>
          <div className={styles.conceptItem}>
            <h2>Workflows</h2>
            <p>The representation of the tasks and actions to consistently automate a process.</p>
          </div>
          <div className={styles.conceptItem}>
            <h2>Actions</h2>
            <p>Manual or approval based tasks that need human interaction</p>
          </div>
          <div className={styles.conceptItem}>
            <h2>Tasks</h2>
            <p>The discrete piece of work that performs the execution or action within a workflow</p>
          </div>
          <div className={styles.conceptItem}>
            <h2>Task Manager</h2>
            <p>The centralized place to define and manage the Tasks available to Workflows.</p>
          </div>
        </nav>
      </Section>
    </>
  );
}

interface SectionProps {
  children: React.ReactNode;
  title: string;
  hasBorder?: boolean;
}

const Section: React.FC<SectionProps> = ({ children, title, hasBorder = false }) => {
  return (
    <section className={cx(styles.section, { [styles.sectionBorder]: hasBorder })}>
      <h1 className={styles.sectionTitle}>{title}</h1>
      {children}
    </section>
  );
};
