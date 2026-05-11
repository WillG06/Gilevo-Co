import { motion } from "framer-motion";
import { TrendingUp, MousePointerClick, Sparkles } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { LineArt } from "@/components/LineArt";
import portrait from "@/assets/portrait-will.jpeg";


const cards = [
  { Icon: TrendingUp, title: "Increase Online Presence", desc: "SEO foundations and content structure designed to compound traffic month-over-month." },
  { Icon: MousePointerClick, title: "Convert More Visitors", desc: "Conversion-focused layouts, clear hierarchy, and friction-free calls to action." },
  { Icon: Sparkles, title: "Stand Out From Competitors", desc: "A bespoke aesthetic that feels considered, premium, and distinctly yours." },
];

const steps = [
  { n: "01", title: "Discovery", desc: "We align on goals, audience, and success metrics." },
  { n: "02", title: "Design", desc: "Mood, typography, layout, iterated to perfection." },
  { n: "03", title: "Build", desc: "Hand-crafted code with obsessive performance discipline." },
  { n: "04", title: "Launch", desc: "Go-live, hand-over, and 30 days of post-launch support." },
];

const stack = ["React", "Node.js", "Next.js", "Typescript", "Tailwind", "Vercel", "GSAP", "Three.js"];

const About = () => {
  return (
    <>
      <PageHero
        eyebrow="About"
        titleSerif="Independent."
        titleSans="Obsessive"
        intro="A Birmingham-based web design and development studio of one, building fast, beautiful, conversion-focused websites for businesses who want to be seen."
        variant="orbit"
      />

      <section className="relative pb-32 overflow-hidden">
        <LineArt variant="topo" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 lg:sticky lg:top-32"
            >
              <div className="relative mx-auto aspect-[4/5] max-w-md rounded-2xl overflow-hidden ring-1 ring-brand-gold/20 bg-paper shadow-xl">
                <img src={portrait} alt="Portrait of Will Giles" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-deep/70 via-transparent to-transparent" />
                <div className="absolute inset-0 grid place-items-end p-6">
                  <div>
                    <p className="signature-script text-5xl text-background leading-none">WGiles</p>
                    <p className="mono text-brand-gold mt-2">Founder · Designer · Developer</p>
                  </div>
                </div>
              </div>
              <p className="mono text-center text-brand-blue mt-6">Birmingham, UK</p>
            </motion.div>

            <div className="lg:col-span-7 space-y-16">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
                <p className="mono text-brand-blue">/ The studio</p>
                <p className="mt-6 text-ink/75 leading-relaxed text-lg">
                  I'm Will, a Birmingham-based web designer and developer building high-performance, conversion-focused websites for businesses wanting to be seen. Every site I create is bespoke, visually refined, and engineered to deliver results.
                </p>
                <p className="mt-4 text-ink/65 leading-relaxed">
                  Every project is hand-crafted end-to-end. No templates, no compromise on the details that turn a good site into a great one.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                <p className="mono text-brand-blue mb-6">/ What I can do for your business</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {cards.map(({ Icon, title, desc }) => (
                    <motion.div
                      key={title}
                      variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
                      className="bg-background border border-hairline rounded-xl p-6 hover:border-brand-blue/40 hover:shadow-lg transition-all"
                    >
                      <Icon className="h-5 w-5 text-brand-gold" />
                      <h3 className="mt-4 font-medium display-sans text-xl text-blue-deep">{title}</h3>
                      <p className="mt-2 text-sm text-ink/65 leading-relaxed">{desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
                <p className="mono text-brand-blue mb-6">/ My Process</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {steps.map((s) => (
                    <motion.div
                      key={s.n}
                      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                      className="border-t border-brand-blue-deep pt-4"
                    >
                      <p className="mono text-brand-gold">{s.n}</p>
                      <h4 className="display-sans text-2xl mt-2 text-blue-deep">{s.title}</h4>
                      <p className="mt-2 text-sm text-ink/60 leading-relaxed">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <p className="mono text-brand-blue mb-4">/ Tools &amp; Stack</p>
                <div className="flex flex-wrap gap-2">
                  {stack.map((s) => (
                    <span key={s} className="px-3.5 py-1.5 rounded-full bg-background border border-hairline mono text-ink/80 hover:text-brand-blue hover:border-brand-blue/40 transition-colors">{s}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
