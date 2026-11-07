import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Hero from './Hero.jsx';
import WhyFPYC from './WhyFPYC.jsx';
import Testimonials from './Testimonials.jsx';
import Programs from './Programs.jsx';
import SeasonCalendar from './SeasonCalendar.jsx';
import SkillsClinic from './SkillsClinic.jsx';
import RefSignup from './RefSignup.jsx';
import SelectOpenGyms from './SelectOpenGyms.jsx';
import HowToRegister from './HowToRegister.jsx';
import TeamSpotlight from './TeamSpotlight.jsx';
import PlayoffBracket from './PlayoffBracket.jsx';
import Standings from './Standings.jsx';
import SeasonRecap from './SeasonRecap.jsx';
import { Announcements, Schedule, News, FaqContact } from './Sections.jsx';

function scrollTo(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

export default function WebsiteApp() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <Header onJump={scrollTo} />
      <main id="top" style={{ scrollBehavior: 'smooth' }}>
        <Hero onRegister={() => scrollTo('register')} />
        <Announcements />
        <Programs />
        <WhyFPYC />
        <SeasonCalendar />
        <HowToRegister />
        <RefSignup />
        <FaqContact />
        {/*
          Hidden until backed by real data — these render placeholder content:
            <TeamSpotlight />  fictional "Fairfax Hawks" record and opponents
            <PlayoffBracket /> no bracket set for the coming season
            <Standings />      fictional opponent clubs
            <SeasonRecap />    fictional team records and league totals
            <Testimonials />   invented quotes and people
            <News />           invented articles

          Hidden because the season has moved past them — re-add once there's
          a real next session to promote:
            <SkillsClinic />    Fall session ended Oct 26; no Spring/Summer dates yet
            <SelectOpenGyms />  tryouts concluded, Select teams are formed

          Hidden — no real public schedule content for this: <Schedule />
          pulls from useGames(), which only holds old archived Summer 3v3
          games, so it rendered stale/irrelevant "upcoming" games. Families
          see the real Winter schedule in the Family Portal instead.
        */}
      </main>
      <Footer />
    </div>
  );
}
