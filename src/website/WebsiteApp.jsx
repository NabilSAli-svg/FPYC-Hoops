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
        <SkillsClinic />
        <SelectOpenGyms />
        <Programs />
        <WhyFPYC />
        <SeasonCalendar />
        <HowToRegister />
        <Schedule />
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
        */}
      </main>
      <Footer />
    </div>
  );
}
