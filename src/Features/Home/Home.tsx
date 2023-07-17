import HomeBanner from "Components/HomeBanner";
import TeamCard from "Components/TeamCard";
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
      <Section title="Your Teams" key="Teams">
        <nav className={styles.sectionLinks}>
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </nav>
      </Section>
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
