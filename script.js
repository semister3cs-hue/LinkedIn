/**
 * ChemConnect - Workshop Engine
 * Topic: Study of LinkedIn for Academic Communication, Professional Networking and Career Development in Chemistry
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initProjectorMode();
  initTeacherMode();
  initSessionTimer();
  initNavigation();
  initPipelineStepper();
  initProfileChecklist();
  initSearchSimulator();
  initNetworkingTable();
  initJobSearchStorage();
  initPostCreator();
  initAssignmentChecklist();
  initObservationTable();
  initVivaAccordion();
  initCopyButtons();
  initScrollWatchers();
  initResetAllData();
  updateGlobalMetrics();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('chem_theme') || 'light';

  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('chem_theme', newTheme);
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    showToast(`Switched to ${newTheme} mode`);
  });
}

/* ==========================================================================
   2. PROJECTOR HIGH-CONTRAST PRESENTATION MODE
   ========================================================================== */
function initProjectorMode() {
  const projectorBtn = document.getElementById('projector-toggle');
  const isProjector = localStorage.getItem('chem_projector_mode') === 'true';

  if (isProjector) {
    document.body.classList.add('projector-mode');
    projectorBtn.classList.add('btn-primary');
  }

  projectorBtn.addEventListener('click', () => {
    const active = document.body.classList.toggle('projector-mode');
    localStorage.setItem('chem_projector_mode', active);
    projectorBtn.classList.toggle('btn-primary', active);
    showToast(active ? 'Projector Mode Enabled (High Contrast)' : 'Standard Display Mode');
  });
}

/* ==========================================================================
   3. FACILITATOR GUIDANCE MODE & SESSION STOPWATCH
   ========================================================================== */
function initTeacherMode() {
  const teacherBtn = document.getElementById('teacher-toggle');
  const isTeacherActive = localStorage.getItem('chem_teacher_mode') === 'true';

  if (isTeacherActive) {
    document.body.classList.add('teacher-active');
    teacherBtn.classList.add('btn-primary');
  }

  teacherBtn.addEventListener('click', () => {
    const active = document.body.classList.toggle('teacher-active');
    localStorage.setItem('chem_teacher_mode', active);
    teacherBtn.classList.toggle('btn-primary', active);
    showToast(active ? 'Facilitator Mode Enabled: Prompts & Timing Visible' : 'Facilitator Mode Disabled');
  });
}

let timerInterval = null;
let timerSeconds = 0;

function initSessionTimer() {
  const timerDisplay = document.getElementById('session-timer-display');
  const timerToggleBtn = document.getElementById('timer-toggle-btn');
  const timerResetBtn = document.getElementById('timer-reset-btn');

  if (!timerDisplay || !timerToggleBtn) return;

  function formatTime(sec) {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  }

  timerToggleBtn.addEventListener('click', () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerToggleBtn.textContent = 'Resume';
      timerToggleBtn.style.background = 'var(--warning)';
    } else {
      timerInterval = setInterval(() => {
        timerSeconds++;
        timerDisplay.textContent = formatTime(timerSeconds);
      }, 1000);
      timerToggleBtn.textContent = 'Pause';
      timerToggleBtn.style.background = 'var(--danger)';
    }
  });

  timerResetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    timerDisplay.textContent = '00:00';
    timerToggleBtn.textContent = 'Start';
    timerToggleBtn.style.background = 'var(--teacher-text)';
  });
}

/* ==========================================================================
   4. NAVIGATION & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const printBtn = document.getElementById('print-record');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Active section spy
  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. PIPELINE STEPPER ACTIVE HIGHLIGHTING (Workshop Learning Flow)
   ========================================================================== */
function initPipelineStepper() {
  const stepNodes = document.querySelectorAll('.step-node');
  const phaseMap = [
    { id: 'phase-1', sections: ['hero', 'what-is-linkedin', 'why-linkedin'] },
    { id: 'phase-2', sections: ['demo-profile', 'academic-communication', 'connection-request'] },
    { id: 'phase-3', sections: ['practical-profile', 'networking', 'career-paths', 'job-practical', 'post-creator'] },
    { id: 'phase-4', sections: ['assignment', 'observation-table-sec'] },
    { id: 'phase-5', sections: ['outcomes', 'viva', 'result'] }
  ];

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    let currentPhase = 'phase-1';
    for (const phase of phaseMap) {
      if (phase.sections.includes(currentSectionId)) {
        currentPhase = phase.id;
        break;
      }
    }

    stepNodes.forEach(node => {
      if (node.dataset.target === currentPhase) {
        node.classList.add('active-step');
      } else {
        node.classList.remove('active-step');
      }
    });
  });
}

/* ==========================================================================
   6. WORKSHOP ACTIVITY 1: PROFILE CHECKLIST & LOCALSTORAGE
   ========================================================================== */
function initProfileChecklist() {
  const checkboxes = document.querySelectorAll('.profile-check');
  const progressPercent = document.getElementById('profile-progress-percent');
  const progressFill = document.getElementById('profile-progress-fill');
  const completeBanner = document.getElementById('profile-complete-banner');
  const resetBtn = document.getElementById('reset-profile-checklist');

  // Load saved state
  checkboxes.forEach((chk, idx) => {
    const saved = localStorage.getItem(`chem_prof_check_${idx}`);
    if (saved === 'true') chk.checked = true;

    chk.addEventListener('change', () => {
      localStorage.setItem(`chem_prof_check_${idx}`, chk.checked);
      calculateProfileScore();
      updateGlobalMetrics();
    });
  });

  function calculateProfileScore() {
    let checked = 0;
    checkboxes.forEach(c => { if (c.checked) checked++; });
    const percent = Math.round((checked / checkboxes.length) * 100);

    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    if (percent === 100) {
      completeBanner.classList.remove('hidden');
    } else {
      completeBanner.classList.add('hidden');
    }
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your profile activity checklist?')) {
        checkboxes.forEach((chk, idx) => {
          chk.checked = false;
          localStorage.removeItem(`chem_prof_check_${idx}`);
        });
        calculateProfileScore();
        updateGlobalMetrics();
        showToast('Profile activity checklist reset.');
      }
    });
  }

  calculateProfileScore();
}

/* ==========================================================================
   7. ACADEMIC SEARCH SIMULATOR (Facilitator Demo)
   ========================================================================== */
const searchDemoDatabase = {
  prof: [
    {
      name: "Dr. Arvind S. Iyer",
      role: "Professor of Analytical Chemistry",
      org: "Indian Institute of Science & Technology",
      tag: "HPLC / Mass Spectrometry Research Lab",
      avatar: "👨‍🏫"
    },
    {
      name: "Dr. Christine Martinez",
      role: "Head, Department of Physical Chemistry",
      org: "Cambridge Molecular Research Center",
      tag: "Kinetics, Spectroscopy & Thermodynamics",
      avatar: "👩‍🏫"
    }
  ],
  researcher: [
    {
      name: "Dr. Rajesh K. Nair",
      role: "Postdoctoral Research Fellow",
      org: "National Chemical Laboratory (CSIR-NCL)",
      tag: "Homogeneous Catalysis & Green Solvents",
      avatar: "👨‍🔬"
    },
    {
      name: "Dr. Priya Sengupta",
      role: "Senior Research Scientist (Polymer Synthesis)",
      org: "Polymer Nano-Composite Institute",
      tag: "Bio-Degradable Materials & Polymers",
      avatar: "👩‍🔬"
    }
  ],
  analytical: [
    {
      name: "Suresh Ramanathan",
      role: "Lead Analytical Method Developer",
      org: "Apex Pharma Formulations",
      tag: "Method Validation / UV-Vis / Chromatography",
      avatar: "🔬"
    },
    {
      name: "Divya Balakrishnan",
      role: "Quality Control Officer",
      org: "EnviroClean Analytical Testing Labs",
      tag: "Water Hardness / Heavy Metal Testing",
      avatar: "🧪"
    }
  ],
  organic: [
    {
      name: "Dr. Marcus Vance",
      role: "Organic Synthesis Specialist",
      org: "Center for Heterocyclic Chemistry",
      tag: "Stereoselective Synthesis / TLC Purification",
      avatar: "⚗️"
    },
    {
      name: "Dr. Neha Kapoor",
      role: "Medicinal Chemistry Investigator",
      org: "Drug Discovery & Synthesis Lab",
      tag: "Lead Optimization / Molecular Docking",
      avatar: "💊"
    }
  ],
  lab: [
    {
      name: "Central Analytical Instrumentation Laboratory",
      role: "Core Academic Testing Facility",
      org: "State University Science Campus",
      tag: "NMR / FTIR / XRD / Spectrophotometry",
      avatar: "🏢"
    },
    {
      name: "Industrial Chemical Safety & GLP Center",
      role: "Certified Chemical Testing Facility",
      org: "National Accreditation Board",
      tag: "Good Laboratory Practice (GLP) Auditing",
      avatar: "🛡️"
    }
  ]
};

function initSearchSimulator() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const resultsContainer = document.getElementById('search-results-box');
  const searchInput = document.getElementById('sim-search-input');

  function render(categoryKey) {
    const list = searchDemoDatabase[categoryKey] || searchDemoDatabase.prof;
    resultsContainer.innerHTML = list.map(item => `
      <div class="sim-result-card">
        <div class="sim-avatar">${item.avatar}</div>
        <div class="sim-info">
          <h5>${item.name}</h5>
          <p>${item.role}</p>
          <p><strong>${item.org}</strong></p>
          <span class="sim-tag">${item.tag}</span>
        </div>
      </div>
    `).join('');
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const target = pill.dataset.search;
      if (target === 'prof') searchInput.value = "Chemistry Professor";
      if (target === 'researcher') searchInput.value = "Chemistry Researcher";
      if (target === 'analytical') searchInput.value = "Analytical Chemistry";
      if (target === 'organic') searchInput.value = "Organic Chemistry Research";
      if (target === 'lab') searchInput.value = "Chemistry Laboratory";

      render(target);
    });
  });

  render('prof');
}

/* ==========================================================================
   8. PROFESSIONAL NETWORKING TABLE (Workshop Activity 2)
   ========================================================================== */
function initNetworkingTable() {
  const saveButtons = document.querySelectorAll('.save-row-btn');
  const clearBtn = document.getElementById('clear-net-table');

  for (let i = 1; i <= 3; i++) {
    const name = localStorage.getItem(`chem_net2_name_${i}`);
    const desig = localStorage.getItem(`chem_net2_desig_${i}`);
    const field = localStorage.getItem(`chem_net2_field_${i}`);
    const rel = localStorage.getItem(`chem_net2_rel_${i}`);

    if (name && document.getElementById(`net-name-${i}`)) document.getElementById(`net-name-${i}`).value = name;
    if (desig && document.getElementById(`net-desig-${i}`)) document.getElementById(`net-desig-${i}`).value = desig;
    if (field && document.getElementById(`net-field-${i}`)) document.getElementById(`net-field-${i}`).value = field;
    if (rel && document.getElementById(`net-rel-${i}`)) document.getElementById(`net-rel-${i}`).value = rel;
  }

  saveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.dataset.row;
      const name = document.getElementById(`net-name-${row}`).value;
      const desig = document.getElementById(`net-desig-${row}`).value;
      const field = document.getElementById(`net-field-${row}`).value;
      const rel = document.getElementById(`net-rel-${row}`).value;

      localStorage.setItem(`chem_net2_name_${row}`, name);
      localStorage.setItem(`chem_net2_desig_${row}`, desig);
      localStorage.setItem(`chem_net2_field_${row}`, field);
      localStorage.setItem(`chem_net2_rel_${row}`, rel);

      showToast(`Professional Contact #${row} saved to workshop records!`);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear the networking activity records table?')) {
        for (let i = 1; i <= 3; i++) {
          ['name', 'desig', 'field', 'rel'].forEach(k => {
            localStorage.removeItem(`chem_net2_${k}_${i}`);
            const el = document.getElementById(`net-${k}-${i}`);
            if (el) el.value = '';
          });
        }
        showToast('Networking activity table cleared.');
      }
    });
  }
}

/* ==========================================================================
   9. CAREER & JOB SEARCH STORAGE (Workshop Activity 3)
   ========================================================================== */
function initJobSearchStorage() {
  const saveBtn = document.getElementById('save-jobs-btn');
  const clearBtn = document.getElementById('clear-jobs-btn');
  const fields = ['opp1-pos', 'opp1-org', 'opp1-skills', 'opp1-elig', 'opp2-pos', 'opp2-org', 'opp2-skills', 'opp2-elig'];

  fields.forEach(f => {
    const val = localStorage.getItem(`chem_job_${f}`);
    if (val && document.getElementById(f)) {
      document.getElementById(f).value = val;
    }
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      fields.forEach(f => {
        const el = document.getElementById(f);
        if (el) localStorage.setItem(`chem_job_${f}`, el.value);
      });
      showToast('Saved 2 Chemistry Career & Job opportunities!');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      fields.forEach(f => {
        localStorage.removeItem(`chem_job_${f}`);
        const el = document.getElementById(f);
        if (el) el.value = '';
      });
      showToast('Opportunity fields cleared.');
    });
  }
}

/* ==========================================================================
   10. CHEMISTRY LINKEDIN POST CREATOR (Workshop Activity 4)
   ========================================================================== */
function initPostCreator() {
  const genBtn = document.getElementById('generate-post-btn');
  const sampleBtn = document.getElementById('load-sample-post-btn');
  const clearBtn = document.getElementById('clear-post-btn');

  const nameInput = document.getElementById('post-name');
  const topicInput = document.getElementById('post-topic');
  const learnedInput = document.getElementById('post-learned');
  const tagsInput = document.getElementById('post-hashtags');

  const previewAuthor = document.getElementById('preview-author');
  const previewBody = document.getElementById('preview-body');

  function renderPost() {
    const name = nameInput.value.trim() || 'Alex Sharma';
    const topic = topicInput.value.trim() || 'Analytical Chemistry';
    const learned = learnedInput.value.trim() || 'Today I learned about the importance of analytical techniques in Chemistry. Analytical chemistry helps identify and quantify substances and has applications in pharmaceuticals, environmental science and research.';
    let tags = tagsInput.value.trim() || '#Chemistry #AnalyticalChemistry #ChemistryStudents #Research';

    previewAuthor.textContent = name;
    previewBody.innerHTML = `
      <p>🧪 <strong>Learning ${topic}</strong></p>
      <p>${learned}</p>
      <p>I look forward to improving my laboratory and analytical skills.</p>
      <p class="post-tags-render">${tags}</p>
    `;
  }

  if (genBtn) {
    genBtn.addEventListener('click', () => {
      renderPost();
      showToast('Academic chemistry post generated!');
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      nameInput.value = "Priya Sharma";
      topicInput.value = "Analytical Chemistry";
      learnedInput.value = "Today I learned about the importance of analytical techniques in Chemistry. Analytical chemistry helps identify and quantify substances and has applications in pharmaceuticals, environmental science and research.";
      tagsInput.value = "#Chemistry #AnalyticalChemistry #ChemistryStudents #Research";
      renderPost();
      showToast('Loaded sample academic post.');
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      nameInput.value = '';
      topicInput.value = '';
      learnedInput.value = '';
      tagsInput.value = '#Chemistry #AnalyticalChemistry #ChemistryStudents #Research';
      renderPost();
      showToast('Post creator inputs cleared.');
    });
  }
}

/* ==========================================================================
   11. WORKSHOP REFLECTION & ACTIVITY CHECKLIST (8 Tasks)
   ========================================================================== */
function initAssignmentChecklist() {
  const assignChecks = document.querySelectorAll('.assign-check');
  const assignPercent = document.getElementById('assignment-progress-percent');
  const assignFill = document.getElementById('assignment-progress-fill');

  assignChecks.forEach((chk, idx) => {
    const state = localStorage.getItem(`chem_assign_task_${idx}`);
    if (state === 'true') chk.checked = true;

    chk.addEventListener('change', () => {
      localStorage.setItem(`chem_assign_task_${idx}`, chk.checked);
      calculateAssignment();
      updateGlobalMetrics();
    });
  });

  function calculateAssignment() {
    let count = 0;
    assignChecks.forEach(c => { if (c.checked) count++; });
    const pct = Math.round((count / assignChecks.length) * 100);

    assignPercent.textContent = `${pct}%`;
    assignFill.style.width = `${pct}%`;
  }

  calculateAssignment();
}

/* ==========================================================================
   12. WORKSHOP ACTIVITY & REFLECTION TABLE STORAGE
   ========================================================================== */
function initObservationTable() {
  const saveBtn = document.getElementById('save-obs-btn');

  for (let i = 1; i <= 5; i++) {
    const obs = localStorage.getItem(`chem_obstable_obs_${i}`);
    const evi = localStorage.getItem(`chem_obstable_evi_${i}`);
    const stat = localStorage.getItem(`chem_obstable_stat_${i}`);

    if (obs && document.getElementById(`obs-${i}`)) document.getElementById(`obs-${i}`).value = obs;
    if (evi && document.getElementById(`evi-${i}`)) document.getElementById(`evi-${i}`).value = evi;
    if (stat && document.getElementById(`stat-${i}`)) document.getElementById(`stat-${i}`).value = stat;
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      for (let i = 1; i <= 5; i++) {
        const obsEl = document.getElementById(`obs-${i}`);
        const eviEl = document.getElementById(`evi-${i}`);
        const statEl = document.getElementById(`stat-${i}`);

        if (obsEl) localStorage.setItem(`chem_obstable_obs_${i}`, obsEl.value);
        if (eviEl) localStorage.setItem(`chem_obstable_evi_${i}`, eviEl.value);
        if (statEl) localStorage.setItem(`chem_obstable_stat_${i}`, statEl.value);
      }
      showToast('Workshop activity & reflection records preserved!');
      updateGlobalMetrics();
    });
  }
}

/* ==========================================================================
   13. WORKSHOP Q&A ACCORDION
   ========================================================================== */
function initVivaAccordion() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.accordion-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ==========================================================================
   14. COPY CLIPBOARD BUTTONS
   ========================================================================== */
function initCopyButtons() {
  const copyMsgBtn = document.getElementById('copy-good-msg-btn');
  if (copyMsgBtn) {
    copyMsgBtn.addEventListener('click', () => {
      const text = document.getElementById('good-connection-msg').innerText;
      copyText(text, 'Personalized connection message copied!');
    });
  }

  const copyPostBtn = document.getElementById('copy-post-btn');
  if (copyPostBtn) {
    copyPostBtn.addEventListener('click', () => {
      const text = document.getElementById('preview-body').innerText;
      copyText(text, 'Chemistry post text copied to clipboard!');
    });
  }
}

function copyText(text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    showToast('Please select and copy the text manually.');
  });
}

/* ==========================================================================
   15. SCROLL WATCHERS & BACK TO TOP
   ========================================================================== */
function initScrollWatchers() {
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   16. RESET WORKSHOP PROGRESS
   ========================================================================== */
function initResetAllData() {
  const resetAllBtn = document.getElementById('reset-all-data-btn');

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('Warning: This will clear ALL checklist ticks, reflection notes, job searches, and networking records. Continue?')) {
        const theme = localStorage.getItem('chem_theme');
        const teacher = localStorage.getItem('chem_teacher_mode');
        const projector = localStorage.getItem('chem_projector_mode');

        localStorage.clear();

        if (theme) localStorage.setItem('chem_theme', theme);
        if (teacher) localStorage.setItem('chem_teacher_mode', teacher);
        if (projector) localStorage.setItem('chem_projector_mode', projector);

        location.reload();
      }
    });
  }
}

/* ==========================================================================
   17. GLOBAL WORKSHOP PROGRESS COMPLIANCE ENGINE
   ========================================================================== */
function updateGlobalMetrics() {
  // Profile Activity Calculation
  const profileChecks = document.querySelectorAll('.profile-check');
  let profDone = 0;
  profileChecks.forEach(c => { if (c.checked) profDone++; });
  const profScore = Math.round((profDone / profileChecks.length) * 100);

  // Reflection Checklist Calculation
  const assignChecks = document.querySelectorAll('.assign-check');
  let assignDone = 0;
  assignChecks.forEach(c => { if (c.checked) assignDone++; });

  // Update DOM Elements
  const metricProfile = document.getElementById('metric-profile-val');
  const metricTasks = document.getElementById('metric-tasks-val');
  const metricStatus = document.getElementById('metric-status-val');
  const globalIndicator = document.getElementById('global-progress-indicator');
  const globalFill = document.getElementById('global-progress-fill');

  if (metricProfile) metricProfile.textContent = `${profScore}%`;
  if (metricTasks) metricTasks.textContent = `${assignDone}/${assignChecks.length}`;

  const overall = Math.round((profScore + (assignDone / assignChecks.length) * 100) / 2);
  if (globalIndicator) globalIndicator.textContent = `${overall}%`;
  if (globalFill) globalFill.style.width = `${overall}%`;

  if (metricStatus) {
    if (profScore === 100 && assignDone === assignChecks.length) {
      metricStatus.textContent = 'COMPLETED ✓';
      metricStatus.style.color = 'var(--success)';
    } else {
      metricStatus.textContent = 'IN PROGRESS';
      metricStatus.style.color = 'var(--warning)';
    }
  }
}

/* ==========================================================================
   18. TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2600);
}