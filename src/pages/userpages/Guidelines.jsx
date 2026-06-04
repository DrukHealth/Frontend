import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaBaby,
  FaCheckCircle,
  FaExclamationTriangle,
  FaNotesMedical,
  FaClipboardList,
  FaStethoscope,
  FaHospitalUser,
  FaArrowRight,
} from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { ThemeContext } from "./ThemeContext";
import "./css/Home.css";
import "./css/Guidelines.css";

export default function Guidelines() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const darkMode = theme === "dark";

  const [openSections, setOpenSections] = useState({
    ctgFeatures: true,
    monitoringMethods: false,
    cefm: false,
    interpretation: false,
    hypoxia: false,
    threeMinuteRule: false,
    actions: false,
    special: false,
    documentation: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={`guidelines-container ${darkMode ? "dark" : "light"}`}>
      {/* ===================== SAME HEADER AS HOME PAGE ===================== */}
      <nav className="navbar">
        {/* LEFT: Logo */}
        <div className="nav-logo-box" onClick={() => navigate("/home")}>
          <img
            src={darkMode ? "/logo2.png" : "/Latestlogo.png"}
            alt="Druk eHealth Logo"
            className="nav-logo"
          />
        </div>

        {/* CENTER: Main Title */}
        <div className="nav-title">
          Intrapartum Fetal Monitoring Guidelines
        </div>

        {/* RIGHT: Dark Mode Toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </nav>

      {/* ===================== BACK BUTTON BELOW NAVBAR ===================== */}
      <div className="guidelines-back-row">
        <button className="back-service-btn" onClick={() => navigate("/home")}>
          Back to Services
        </button>
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="guidelines-hero">
        <p>
          A structured CTG guideline page based on physiology-based fetal
          monitoring principles. It helps healthcare users review CTG features,
          fetal hypoxia patterns, monitoring methods, emergency signs, and
          documentation requirements.
        </p>

        <div className="hero-actions">
          <button onClick={() => navigate("/ctg-scan")}>
            Start CTG Scan <FaArrowRight />
          </button>
        </div>
      </section>

      {/* ===================== DISCLAIMER ===================== */}
      <section className="guideline-warning-section">
        <FaExclamationTriangle />
        <div>
          <h3>Important Clinical Disclaimer</h3>
          <p>
            Fetal monitoring is only one part of the overall clinical assessment
            of the mother and fetus. CTG interpretation must be used together
            with the full clinical picture, including maternal condition,
            labour progress, risk factors, and local hospital protocols. This
            app page is for educational and clinical-support use only and must
            not replace trained medical judgement.
          </p>
        </div>
      </section>

      {/* ===================== QUICK OVERVIEW CARDS ===================== */}
      <section className="guidelines-grid">
        <div className="guideline-card">
          <FaHeartbeat className="guideline-card-icon" />
          <h3>CTG Purpose</h3>
          <p>
            CTG is used during labour to monitor fetal heart rate and uterine
            contractions. Its main purpose is timely detection of babies who may
            be developing hypoxia.
          </p>
        </div>

        <div className="guideline-card">
          <FaBaby className="guideline-card-icon" />
          <h3>Physiology-Based Approach</h3>
          <p>
            Instead of only recognising patterns, physiology-based CTG looks at
            how the fetus responds to hypoxic stress and whether compensation is
            being maintained.
          </p>
        </div>

        <div className="guideline-card">
          <FaStethoscope className="guideline-card-icon" />
          <h3>Clinical Context</h3>
          <p>
            Always consider gestational age, antenatal events, current labour
            condition, fetal movements, meconium, maternal temperature, and
            previous CTG traces.
          </p>
        </div>
      </section>

      {/* ===================== CTG FEATURES ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("ctgFeatures")}
        >
          <span>Core CTG Features</span>
          <span>{openSections.ctgFeatures ? "−" : "+"}</span>
        </button>

        {openSections.ctgFeatures && (
          <div className="collapse-content">
            <p className="section-intro">
              CTG assessment should include baseline fetal heart rate,
              variability, accelerations, decelerations, contractions, and the
              overall clinical picture.
            </p>

            <div className="feature-grid">
              <div className="feature-box">
                <h3>1. Baseline Fetal Heart Rate</h3>
                <p>
                  Baseline is the mean fetal heart rate over a 10-minute
                  segment, excluding accelerations, decelerations, and marked
                  variability.
                </p>
                <ul>
                  <li>Normal baseline: 110–160 bpm</li>
                  <li>Tachycardia: above 160 bpm for more than 10 minutes</li>
                  <li>Bradycardia: below 110 bpm for more than 10 minutes</li>
                  <li>
                    A baseline change of more than 10% needs further attention
                  </li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>2. Variability</h3>
                <p>
                  Variability reflects oscillations in the fetal heart rate and
                  is documented in beats per minute.
                </p>
                <ul>
                  <li>Normal variability: 5–25 bpm</li>
                  <li>Reduced variability: below 5 bpm for prolonged periods</li>
                  <li>Saltatory pattern: more than 25 bpm</li>
                  <li>Sinusoidal pattern requires urgent clinical attention</li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>3. Accelerations</h3>
                <p>
                  Accelerations are abrupt rises in fetal heart rate above
                  baseline. They usually indicate reassuring fetal response.
                </p>
                <ul>
                  <li>Rise of more than 15 bpm</li>
                  <li>Lasts more than 15 seconds</li>
                  <li>Should start from and return to a stable baseline</li>
                  <li>
                    If accelerations coincide with contractions, exclude
                    maternal heart rate
                  </li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>4. Decelerations</h3>
                <p>
                  Decelerations are falls in fetal heart rate below baseline.
                  They may represent fetal response to mechanical or hypoxic
                  stress.
                </p>
                <ul>
                  <li>Early: usually due to fetal head compression</li>
                  <li>Variable: often due to cord compression</li>
                  <li>Late: may suggest fetal hypoxaemia</li>
                  <li>Prolonged: lasts more than 3 minutes</li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>5. Contractions</h3>
                <p>
                  Contractions should be assessed for frequency, duration,
                  strength, and resting tone between contractions.
                </p>
                <ul>
                  <li>More than 5 contractions in 10 minutes is tachysystole</li>
                  <li>Contractions lasting over 2 minutes may be concerning</li>
                  <li>Hyperstimulation can cause fetal heart rate changes</li>
                  <li>
                    Manual palpation may be needed if CTG signal is unreliable
                  </li>
                </ul>
              </div>

              <div className="feature-box">
                <h3>6. Cycling</h3>
                <p>
                  Cycling means alternation between fetal behavioural states and
                  is a reassuring sign of fetal neurological responsiveness.
                </p>
                <ul>
                  <li>Deep sleep can last up to 50 minutes</li>
                  <li>Active sleep shows accelerations and normal variability</li>
                  <li>Wakefulness may show frequent accelerations</li>
                  <li>Absence of cycling may suggest concern</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== MONITORING METHODS ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("monitoringMethods")}
        >
          <span>Monitoring Methods</span>
          <span>{openSections.monitoringMethods ? "−" : "+"}</span>
        </button>

        {openSections.monitoringMethods && (
          <div className="collapse-content">
            <div className="method-grid">
              <div className="method-card">
                <FaStethoscope />
                <h3>Intermittent Auscultation</h3>
                <p>
                  Recommended for healthy women with uncomplicated pregnancies.
                  It is usually performed using a Doppler ultrasound or Pinard
                  stethoscope.
                </p>

                <ul>
                  <li>Ask about fetal movements in the last 24 hours</li>
                  <li>Perform abdominal palpation</li>
                  <li>Listen for at least 1 full minute</li>
                  <li>First stage: every 15 minutes</li>
                  <li>Active second stage: every 5 minutes</li>
                  <li>Document fetal heart as a single number</li>
                </ul>
              </div>

              <div className="method-card">
                <FaHospitalUser />
                <h3>Continuous Electronic Fetal Monitoring</h3>
                <p>
                  CEFM is used when maternal or fetal risk factors are present.
                  It is a screening tool for hypoxia and does not replace
                  clinical observations.
                </p>

                <ul>
                  <li>Used in high-risk pregnancy or labour</li>
                  <li>Required with oxytocin augmentation</li>
                  <li>Required if repeated decelerations are detected</li>
                  <li>Consider with meconium-stained liquor</li>
                  <li>
                    Encourage upright position and mobility where possible
                  </li>
                  <li>Review CTG with full clinical context</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== CEFM INDICATIONS ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("cefm")}
        >
          <span>When to Use Continuous Electronic Fetal Monitoring</span>
          <span>{openSections.cefm ? "−" : "+"}</span>
        </button>

        {openSections.cefm && (
          <div className="collapse-content">
            <div className="table-wrapper">
              <table className="guideline-table">
                <thead>
                  <tr>
                    <th>Maternal Indications</th>
                    <th>Fetal Indications</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>Gestation below 37 weeks or above 42 weeks</td>
                    <td>Known or suspected IUGR</td>
                  </tr>
                  <tr>
                    <td>Induced labour or oxytocin administration</td>
                    <td>Reduced fetal movements in the last 24 hours</td>
                  </tr>
                  <tr>
                    <td>Antepartum or intrapartum haemorrhage</td>
                    <td>Meconium-stained liquor</td>
                  </tr>
                  <tr>
                    <td>Pre-eclampsia or significant maternal illness</td>
                    <td>Oligohydramnios or polyhydramnios</td>
                  </tr>
                  <tr>
                    <td>Previous uterine scar</td>
                    <td>Multiple pregnancy</td>
                  </tr>
                  <tr>
                    <td>Contractions more than 5 in 10 minutes</td>
                    <td>Repeated decelerations or slow recovery decelerations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* ===================== CTG INTERPRETATION STEPS ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("interpretation")}
        >
          <span>Step-by-Step CTG Interpretation</span>
          <span>{openSections.interpretation ? "−" : "+"}</span>
        </button>

        {openSections.interpretation && (
          <div className="collapse-content">
            <div className="steps-list">
              <div>
                <span>01</span>
                <p>
                  Assess the clinical setting: gestational age, antenatal
                  events, medications, previous CTG traces, and fetal growth.
                </p>
              </div>

              <div>
                <span>02</span>
                <p>
                  Identify the current clinical situation and the reason for CTG
                  monitoring.
                </p>
              </div>

              <div>
                <span>03</span>
                <p>
                  Set the limits acceptable as normal for this specific fetus
                  before assessing the trace.
                </p>
              </div>

              <div>
                <span>04</span>
                <p>
                  Assess contractions, baseline heart rate, variability,
                  cycling, accelerations, decelerations, and signal quality.
                </p>
              </div>

              <div>
                <span>05</span>
                <p>
                  Decide whether there is no hypoxia, chronic hypoxia,
                  gradually evolving hypoxia, subacute hypoxia, acute hypoxia,
                  or uncertainty about fetal wellbeing.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== HYPOXIA PATTERNS ===================== */}
      <section className="hypoxia-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("hypoxia")}
        >
          <span>Physiology of Hypoxia in Labour</span>
          <span>{openSections.hypoxia ? "−" : "+"}</span>
        </button>

        {openSections.hypoxia && (
          <div className="collapse-content">
            <p className="section-intro">
              The guideline describes several patterns of fetal hypoxia during
              labour. Recognising the pattern helps guide urgency and
              management.
            </p>

            <div className="hypoxia-grid">
              <div className="hypoxia-card no-hypoxia">
                <h3>No Hypoxia</h3>
                <ul>
                  <li>Baseline appropriate for gestational age</li>
                  <li>Normal variability and cycling</li>
                  <li>No repetitive decelerations</li>
                </ul>
                <p>Management: routine review if CTG continues.</p>
              </div>

              <div className="hypoxia-card chronic">
                <h3>Chronic Hypoxia</h3>
                <ul>
                  <li>Higher baseline than expected</li>
                  <li>Reduced variability or absence of cycling</li>
                  <li>Absence of accelerations</li>
                  <li>Shallow decelerations</li>
                </ul>
                <p>
                  Management: avoid further stress and expedite if necessary.
                </p>
              </div>

              <div className="hypoxia-card gradual">
                <h3>Gradually Evolving Hypoxia</h3>
                <ul>
                  <li>Decelerations appear first</li>
                  <li>Loss of accelerations and cycling</li>
                  <li>Rise in baseline</li>
                  <li>Reduced variability may follow</li>
                </ul>
                <p>Management: improve fetal conditions early.</p>
              </div>

              <div className="hypoxia-card subacute">
                <h3>Subacute Hypoxia</h3>
                <ul>
                  <li>Fetus spends more time in decelerations than baseline</li>
                  <li>Often caused by uterine hyperstimulation</li>
                  <li>May occur during active pushing</li>
                </ul>
                <p>
                  Management: stop/reduce uterotonics, avoid supine position,
                  consider tocolysis, and expedite if no improvement.
                </p>
              </div>

              <div className="hypoxia-card acute">
                <h3>Acute Hypoxia</h3>
                <ul>
                  <li>Prolonged deceleration more than 3 minutes</li>
                  <li>
                    May be caused by cord prolapse, abruption, or uterine
                    rupture
                  </li>
                  <li>May also follow hypotension or hyperstimulation</li>
                </ul>
                <p>
                  Management: follow the 3-minute rule and escalate urgently.
                </p>
              </div>

              <div className="hypoxia-card uncertain">
                <h3>Unable to Ascertain Wellbeing</h3>
                <ul>
                  <li>Poor signal quality</li>
                  <li>Uncertain baseline</li>
                  <li>Possible maternal heart rate recording</li>
                </ul>
                <p>
                  Management: escalate, improve signal quality, and consider
                  fetal scalp electrode if appropriate.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== 3 MINUTE RULE ===================== */}
      <section className="guideline-section emergency-rule collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("threeMinuteRule")}
        >
          <span>The 3-Minute Rule for Prolonged Deceleration</span>
          <span>{openSections.threeMinuteRule ? "−" : "+"}</span>
        </button>

        {openSections.threeMinuteRule && (
          <div className="collapse-content">
            <div className="timeline">
              <div className="timeline-item">
                <span>0–3 min</span>
                <p>
                  If deceleration continues for more than 3 minutes with no
                  recovery, raise the emergency alarm and call the on-call team.
                </p>
              </div>

              <div className="timeline-item">
                <span>3–6 min</span>
                <p>
                  Identify the cause. Check for cord prolapse, placental
                  abruption, uterine rupture, maternal hypotension, or uterine
                  hyperstimulation.
                </p>
              </div>

              <div className="timeline-item">
                <span>6–9 min</span>
                <p>
                  Look for recovery signs such as return of variability and
                  improvement in heart rate. If no recovery, prepare for
                  immediate delivery.
                </p>
              </div>

              <div className="timeline-item">
                <span>9–12 min</span>
                <p>
                  Deceleration should have recovered or delivery preparation
                  should be in progress by the safest and quickest route.
                </p>
              </div>

              <div className="timeline-item">
                <span>12–15 min</span>
                <p>
                  Aim to deliver the fetus if recovery has not occurred and
                  urgent delivery is required.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== REVERSIBLE ACTIONS ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("actions")}
        >
          <span>Actions When Fetal Hypoxia is Suspected</span>
          <span>{openSections.actions ? "−" : "+"}</span>
        </button>

        {openSections.actions && (
          <div className="collapse-content">
            <div className="action-grid">
              <div>
                <FaCheckCircle />
                <h3>Improve Maternal Position</h3>
                <p>
                  Avoid supine position. Turn the mother to lateral or upright
                  position to reduce aorto-caval compression.
                </p>
              </div>

              <div>
                <FaCheckCircle />
                <h3>Reduce Uterine Stress</h3>
                <p>
                  Stop or reduce oxytocin. Remove prostaglandin if used.
                  Consider tocolysis when hyperstimulation persists.
                </p>
              </div>

              <div>
                <FaCheckCircle />
                <h3>Correct Hypotension</h3>
                <p>
                  Sudden hypotension after epidural or spinal anaesthesia may
                  require rapid fluids and anaesthetic review.
                </p>
              </div>

              <div>
                <FaCheckCircle />
                <h3>Escalate Early</h3>
                <p>
                  If fetal wellbeing cannot be determined or CTG deteriorates,
                  escalate to senior midwife or obstetric team without delay.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== SPECIAL CIRCUMSTANCES ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("special")}
        >
          <span>Special Circumstances to Consider</span>
          <span>{openSections.special ? "−" : "+"}</span>
        </button>

        {openSections.special && (
          <div className="collapse-content">
            <div className="special-grid">
              <div>
                <h3>Meconium</h3>
                <p>
                  Meconium-stained liquor requires extra vigilance for signs of
                  hypoxia. A lower threshold for expedited delivery may be
                  considered when meconium is present with CTG concerns.
                </p>
              </div>

              <div>
                <h3>Oxytocin and Hyperstimulation</h3>
                <p>
                  Oxytocin can cause frequent or prolonged contractions. If CTG
                  concern occurs, stop oxytocin and assess fetal condition before
                  restarting.
                </p>
              </div>

              <div>
                <h3>Maternal Pyrexia</h3>
                <p>
                  Maternal fever increases fetal metabolic demand and may
                  increase risk of hypoxia. Treat fever and infection according
                  to clinical protocol.
                </p>
              </div>

              <div>
                <h3>Epidural</h3>
                <p>
                  Epidural may cause maternal hypotension and reduced placental
                  perfusion. Correct with position change, fluids, and
                  anaesthetic support where required.
                </p>
              </div>

              <div>
                <h3>Previous Uterine Scar</h3>
                <p>
                  Uterine scar rupture can present as acute hypoxia. A sudden
                  drop in fetal heart rate in scarred uterus needs urgent
                  review.
                </p>
              </div>

              <div>
                <h3>Preterm Fetus</h3>
                <p>
                  Preterm CTG may show higher baseline, reduced variability,
                  smaller accelerations, and less developed cycling due to
                  immaturity.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== DOCUMENTATION ===================== */}
      <section className="guideline-section collapsible-section">
        <button
          className="collapse-header"
          onClick={() => toggleSection("documentation")}
        >
          <span>Documentation and Quality Checks</span>
          <span>{openSections.documentation ? "−" : "+"}</span>
        </button>

        {openSections.documentation && (
          <div className="collapse-content">
            <div className="documentation-list">
              <div>
                <FaClipboardList />
                <p>Confirm correct date, time, paper scale, and machine setup.</p>
              </div>

              <div>
                <FaClipboardList />
                <p>
                  Document patient name, date of birth, hospital number, machine
                  number, and indication for monitoring.
                </p>
              </div>

              <div>
                <FaClipboardList />
                <p>
                  Document maternal observations, maternal pulse, blood
                  pressure, temperature, and relevant intrapartum events.
                </p>
              </div>

              <div>
                <FaClipboardList />
                <p>
                  If fetal heart rate is similar to maternal heart rate, confirm
                  the trace is fetal and not maternal.
                </p>
              </div>

              <div>
                <FaClipboardList />
                <p>
                  If signal quality is poor, escalate and consider methods to
                  improve fetal heart rate recording.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ===================== FINAL NOTE ===================== */}
      <section className="final-note">
        <h2>Final Clinical Reminder</h2>
        <p>
          CTG interpretation should never be based on the trace alone. Always
          combine CTG findings with the wider clinical picture, maternal
          condition, labour progress, gestational age, fetal risk factors, and
          senior clinical judgement.
        </p>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="ctg-footer">
        <p>
          © {new Date().getFullYear()} Druk{" "}
          <span className="footer-e-letter">e</span>Health. All rights reserved.
        </p>
      </footer>
    </div>
  );
}