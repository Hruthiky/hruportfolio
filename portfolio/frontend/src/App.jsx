import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaAward,
  FaCode,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaLinkedin,
  FaMapMarkerAlt,
  FaMoon,
  FaPhoneAlt,
  FaProjectDiagram,
  FaRocket,
  FaSwatchbook,
  FaSun,
  FaTrophy,
  FaTools,
  FaUserTie,
  FaWifi
} from "react-icons/fa";
import { aiTools, certifications, highlights, profile, projects, services, skills, stats } from "./data";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const colorThemes = [
  { id: "ocean", label: "Ocean" },
  { id: "sunset", label: "Sunset" },
  { id: "neon", label: "Neon" }
];

const SHAKE_MS = 520;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactFieldErrors(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = true;
  if (!values.email.trim()) errors.email = true;
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = true;
  if (!values.subject.trim()) errors.subject = true;
  if (!values.message.trim()) errors.message = true;
  return errors;
}

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ message: "", error: false });
  const [fieldShake, setFieldShake] = useState({});
  const shakeClearRef = useRef(0);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem("colorTheme") || "ocean");
  const theme3dRootRef = useRef(null);

  useEffect(() => () => window.clearTimeout(shakeClearRef.current), []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent-theme", colorTheme);
    localStorage.setItem("colorTheme", colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return undefined;

    const root = theme3dRootRef.current;
    if (!root) return undefined;

    const onMove = (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      root.style.setProperty("--look-x", `${y * -18}deg`);
      root.style.setProperty("--look-y", `${x * 22}deg`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const displayName = profile.name;

  const [typedName, setTypedName] = useState("");
  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setTypedName(displayName);
      return undefined;
    }

    const stepMs = displayName.length > 28 ? 42 : 52;
    let index = 1;
    setTypedName(displayName.slice(0, index));
    if (displayName.length <= 1) return undefined;

    const timerId = window.setInterval(() => {
      index += 1;
      setTypedName(displayName.slice(0, index));
      if (index >= displayName.length) window.clearInterval(timerId);
    }, stepMs);

    return () => window.clearInterval(timerId);
  }, [displayName]);

  const skillSections = useMemo(
    () => [
      { title: "Technical Skills", items: skills.technical, icon: <FaCode /> },
      { title: "Technologies & Tools", items: skills.technologies, icon: <FaTools /> },
      { title: "Networking", items: skills.networking, icon: <FaWifi /> },
      { title: "Languages", items: skills.languages, icon: <FaGlobe /> },
      { title: "Personal Skills", items: skills.personal, icon: <FaUserTie /> }
    ],
    []
  );

  const onChange = (event) => {
    const { name, value } = event.target;
    setFieldShake((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const errors = contactFieldErrors(form);
    if (Object.keys(errors).length > 0) {
      setFieldShake(errors);
      window.clearTimeout(shakeClearRef.current);
      shakeClearRef.current = window.setTimeout(() => setFieldShake({}), SHAKE_MS);
      const order = ["name", "email", "subject", "message"];
      const firstInvalid = order.find((key) => errors[key]);
      if (firstInvalid) {
        requestAnimationFrame(() => {
          document.querySelector(`input[name="${firstInvalid}"], textarea[name="${firstInvalid}"]`)?.focus();
        });
      }
      return;
    }

    const body = `${form.message}\n\n— ${form.name}\n${form.email}`;
    const mailtoUrl = `mailto:${profile.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setStatus({
      message: `Opening your email app… If nothing opens, write to ${profile.email}`,
      error: false
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="app">
      <div className="bg-grid" />
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />
      <div className="bg-particles">
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={`particle-${index}`} />
        ))}
      </div>

      <div className="theme-3d-root" ref={theme3dRootRef} aria-hidden="true">
        <div className="theme-3d-anchor theme-3d-anchor--hero">
          <div className="theme-3d-gyro">
            <div className="theme-3d-spinner">
              <div className="theme-3d-halo" />
              <div className="theme-3d-halo theme-3d-halo--echo" />
              <div className="theme-3d-crystal">
                <div className="theme-3d-plane" />
                <div className="theme-3d-plane" />
                <div className="theme-3d-plane" />
              </div>
              <div className="theme-3d-node theme-3d-node--a" />
              <div className="theme-3d-node theme-3d-node--b" />
              <div className="theme-3d-node theme-3d-node--c" />
            </div>
          </div>
        </div>
        <div className="theme-3d-anchor theme-3d-anchor--rear">
          <div className="theme-3d-gyro">
            <div className="theme-3d-spinner theme-3d-spinner--slow">
              <div className="theme-3d-halo theme-3d-halo--small" />
              <div className="theme-3d-crystal theme-3d-crystal--small">
                <div className="theme-3d-plane" />
                <div className="theme-3d-plane" />
                <div className="theme-3d-plane" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className="nav">
        <div className="brand-block">
          <h3>{profile.name}</h3>
          <p>Portfolio</p>
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#ai-tools">AI Tools</a>
          <a href="#certifications">Certificates</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <button
            className="theme-btn"
            type="button"
            onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
            aria-label="Toggle dark and light mode"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />} {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div className="palette-wrap">
            <span>
              <FaSwatchbook />
            </span>
            <div className="palette-options">
              {colorThemes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`palette-btn ${colorTheme === item.id ? "active" : ""}`}
                  onClick={() => setColorTheme(item.id)}
                  aria-label={`Switch to ${item.label} theme`}
                />
              ))}
            </div>
          </div>
          <a href="#contact" className="btn btn-small">
            Hire Me
          </a>
        </div>
      </header>

      <main className="container">
        <motion.section
          id="home"
          className="hero card"
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.7 }}
        >
          <div className="hero-grid">
            <div>
              <p className="tag">Open to Opportunities</p>
              <h1 className="hero-name-heading" aria-label={displayName}>
                <span className="hero-name-type" aria-hidden="true">
                  {typedName}
                  <span className="type-cursor" />
                </span>
              </h1>
              <h2 className="gradient-text">{profile.role}</h2>
              <p className="objective">{profile.objective}</p>
              <div className="hero-actions">
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn">
                  <FaLinkedin /> LinkedIn
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <FaGithub /> GitHub
                </a>
                <a href={profile.leetcode} target="_blank" rel="noreferrer" className="btn btn-outline leet-btn">
                  <FaTrophy /> LeetCode
                </a>
                <a href={profile.resumeFile} target="_blank" rel="noreferrer" className="btn btn-resume">
                  <FaDownload /> Download Resume
                </a>
              </div>
            </div>
            <div className="profile-wrap">
              <div className="profile-orbit">
                <div className="profile-shell">
                  <div className="profile-shell-inner">
                    <img
                      src={profile.profileImage}
                      alt={`Portrait of ${displayName}`}
                      className="profile-img"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-row">
            <span>
              <FaPhoneAlt /> {profile.phone}
            </span>
            <span>
              <FaEnvelope /> {profile.email}
            </span>
            <span>
              <FaMapMarkerAlt /> {profile.location}
            </span>
          </div>
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {stats.map((item) => (
              <motion.article key={item.label} className="stat-card" variants={fadeUp}>
                <h4>{item.value}</h4>
                <p>{item.label}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <section className="marquee card">
          <div className="marquee-track">
            {[...highlights, ...highlights].map((text, index) => (
              <span key={`${text}-${index}`}>#{text}</span>
            ))}
          </div>
        </section>

        <motion.section
          id="projects"
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>
            <FaProjectDiagram /> Projects
          </h3>
          <motion.div className="grid" variants={staggerContainer} initial="hidden" whileInView="show">
            {projects.map((project) => (
              <motion.article key={project.title} className="project-card" variants={fadeUp}>
                <img src={project.image} alt={project.title} className="project-image" />
                <h4>{project.title}</h4>
                <p className="meta">{project.stack}</p>
                <p>{project.description}</p>
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
                    View Live Project
                  </a>
                )}
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>
            <FaRocket /> What I Offer
          </h3>
          <div className="offer-grid">
            {services.map((service) => (
              <article key={service.title} className="offer-card">
                <h4>{service.title}</h4>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="ai-tools"
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>
            <FaTools /> AI & Developer Tools
          </h3>
          <div className="tools-grid">
            {aiTools.map((tool) => (
              <article key={tool.name} className="tool-card">
                <h4>{tool.name}</h4>
                <p>{tool.description}</p>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="certifications"
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>
            <FaAward /> Certifications & Achievements
          </h3>
          <div className="certs">
            {certifications.map((cert) => (
              <article key={`${cert.issuer}-${cert.period}`} className="cert-card">
                <div className="cert-head">
                  <img
                    src={cert.logo}
                    alt={`${cert.issuer} logo`}
                    className="cert-logo"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <span className="cert-fallback">{cert.short}</span>
                  <h4>{cert.issuer}</h4>
                </div>
                <p className="meta">{cert.period}</p>
                <ul>
                  {cert.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="skills"
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>
            <FaCode /> Skills
          </h3>
          <div className="skills-grid">
            {skillSections.map((section) => (
              <article key={section.title} className="skill-card">
                <h4>
                  {section.icon} {section.title}
                </h4>
                <div className="chips">
                  {section.items.map((item) => (
                    <span key={item} className="chip">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="contact"
          className="card section"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <h3>Contact Me</h3>
          <form className="contact-form" noValidate onSubmit={onSubmit}>
            <label className="contact-field">
              <span className="field-label">
                Your name <span className="required-mark" aria-hidden="true">*</span>
              </span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your Name"
                required
                aria-required="true"
                aria-invalid={fieldShake.name ? "true" : undefined}
                className={fieldShake.name ? "field-shake field-invalid-glow" : undefined}
              />
            </label>
            <label className="contact-field">
              <span className="field-label">
                Email <span className="required-mark" aria-hidden="true">*</span>
              </span>
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Your Email"
                required
                aria-required="true"
                aria-invalid={fieldShake.email ? "true" : undefined}
                className={fieldShake.email ? "field-shake field-invalid-glow" : undefined}
              />
            </label>
            <label className="contact-field">
              <span className="field-label">
                Subject <span className="required-mark" aria-hidden="true">*</span>
              </span>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="Subject"
                required
                aria-required="true"
                aria-invalid={fieldShake.subject ? "true" : undefined}
                className={fieldShake.subject ? "field-shake field-invalid-glow" : undefined}
              />
            </label>
            <label className="contact-field">
              <span className="field-label">
                Message <span className="required-mark" aria-hidden="true">*</span>
              </span>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Write your message..."
                rows="5"
                required
                aria-required="true"
                aria-invalid={fieldShake.message ? "true" : undefined}
                className={fieldShake.message ? "field-shake field-invalid-glow" : undefined}
              />
            </label>
            <button className="btn" type="submit">
              Send via email
            </button>
          </form>
          {status.message && (
            <p className={status.error ? "feedback error" : "feedback success"}>{status.message}</p>
          )}
        </motion.section>
      </main>
    </div>
  );
}
