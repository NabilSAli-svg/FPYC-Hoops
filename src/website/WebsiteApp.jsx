import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Hero from './Hero.jsx';
import WhyFPYC from './WhyFPYC.jsx';
import Testimonials from './Testimonials.jsx';
import Programs from './Programs.jsx';
import SeasonCalendar from './SeasonCalendar.jsx';
import HowToRegister from './HowToRegister.jsx';
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
    <>
      <Header onJump={scrollTo} />
      <main id="top" style={{ scrollBehavior: 'smooth' }}>
        <Hero onRegister={() => scrollTo('register')} />
        <Announcements />
        <WhyFPYC />
        <Testimonials />
        <Programs />
        <SeasonCalendar />
        <HowToRegister />
        <Schedule />
        <News />
        <FaqContact />
      </main>
      <Footer />
    </>
  );
}
