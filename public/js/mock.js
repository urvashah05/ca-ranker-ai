import { saveMockResult, getSubjectsForGoal } from '/js/storage.js'

// --- QUESTION BANK --------------------------------------------
const QB = {
  FR: [
    { q:"As per Ind AS 16, PPE is initially measured at:", opts:["Fair Value","Cost","Net Realisable Value","Written Down Value"], ans:1, exp:"Ind AS 16 requires initial recognition at cost including purchase price and directly attributable costs." },
    { q:"Which standard deals with Leases under Ind AS?", opts:["Ind AS 17","Ind AS 116","Ind AS 16","Ind AS 108"], ans:1, exp:"Ind AS 116 replaced Ind AS 17 and requires recognition of right-of-use assets and lease liabilities." },
    { q:"Goodwill on consolidation arises when:", opts:["Purchase consideration > Net assets acquired","Net assets > Purchase consideration","Revenue > Expenses","Assets > Liabilities"], ans:0, exp:"Goodwill = Purchase consideration minus fair value of net identifiable assets acquired." },
    { q:"Under Ind AS 2, inventories are measured at:", opts:["Cost only","NRV only","Lower of Cost or NRV","Higher of Cost or NRV"], ans:2, exp:"Ind AS 2 requires inventories to be measured at the lower of cost and net realisable value." },
    { q:"Which method is NOT permitted under Ind AS 2 for cost of inventories?", opts:["FIFO","Weighted Average","LIFO","Specific Identification"], ans:2, exp:"LIFO (Last In First Out) is not permitted under Ind AS 2." },
    { q:"Ind AS 36 deals with:", opts:["Revenue Recognition","Impairment of Assets","Employee Benefits","Provisions"], ans:1, exp:"Ind AS 36 prescribes procedures to ensure assets are not carried at more than their recoverable amount." },
    { q:"Under Ind AS 109, financial assets are classified into how many categories?", opts:["2","3","4","5"], ans:1, exp:"Ind AS 109 classifies financial assets into 3 categories: Amortised Cost, FVTOCI, and FVTPL." },
    { q:"The concept of 'substance over form' is related to:", opts:["Prudence","True and Fair View","Faithful Representation","Materiality"], ans:2, exp:"Faithful representation requires that transactions are accounted for according to their substance and economic reality." },
    { q:"Under Ind AS 115, revenue is recognised when:", opts:["Cash is received","Invoice is raised","Performance obligation is satisfied","Contract is signed"], ans:2, exp:"Revenue is recognised when (or as) a performance obligation is satisfied by transferring a promised good or service." },
    { q:"Deferred tax is created due to:", opts:["Permanent differences","Timing differences","Both","Neither"], ans:1, exp:"Deferred tax arises due to temporary (timing) differences between accounting profit and taxable profit." },
    { q:"Under Ind AS 19, actuarial gains and losses on defined benefit plans are recognised in:", opts:["P&L","OCI","Retained Earnings","Balance Sheet directly"], ans:1, exp:"Actuarial gains and losses are recognised in Other Comprehensive Income (OCI) under Ind AS 19." },
    { q:"Which of the following is a non-adjusting event as per Ind AS 10?", opts:["Discovery of fraud before year end","Major business combination after year end","Correction of error","Finalisation of litigation"], ans:1, exp:"Events after the reporting period that are non-adjusting do not affect the financial statements but require disclosure." },
    { q:"Under Ind AS 38, internally generated goodwill is:", opts:["Capitalised","Expensed","Amortised","Disclosed only"], ans:1, exp:"Internally generated goodwill cannot be recognised as an asset under Ind AS 38." },
    { q:"The effective interest rate method is used for:", opts:["Depreciation","Financial instruments at amortised cost","Inventory valuation","Revenue recognition"], ans:1, exp:"The effective interest rate method is used to calculate the amortised cost of a financial instrument." },
    { q:"Under Ind AS 21, foreign currency transactions are initially recorded at:", opts:["Closing rate","Average rate","Spot rate on transaction date","Forward rate"], ans:2, exp:"Foreign currency transactions are initially recorded using the spot exchange rate at the date of the transaction." },
  ],
  DT: [
    { q:"Under Section 54F, exemption from LTCG is available if net consideration is invested in:", opts:["Any asset","Residential house property","NHAI bonds","Gold ETF"], ans:1, exp:"Section 54F provides exemption when net sale consideration is invested in one residential house." },
    { q:"The rate of surcharge on partnership firms when income exceeds Rs. 1 crore is:", opts:["10%","12%","15%","No surcharge"], ans:1, exp:"Partnership firms pay surcharge at 12% when total income exceeds Rs. 1 crore." },
    { q:"Under Section 80C, the maximum deduction allowed is:", opts:["Rs. 1 lakh","Rs. 1.5 lakhs","Rs. 2 lakhs","Rs. 50,000"], ans:1, exp:"The maximum deduction under Section 80C is Rs. 1,50,000 per financial year." },
    { q:"Long-term capital gain on listed equity shares is taxable at:", opts:["10% without indexation","20% with indexation","15%","Exempt"], ans:0, exp:"LTCG on listed equity shares exceeding Rs. 1 lakh is taxable at 10% without indexation benefit." },
    { q:"The due date for filing ITR for a company (non-audit) is:", opts:["31st July","30th September","31st October","30th November"], ans:1, exp:"Companies are required to file their income tax return by 30th September of the assessment year." },
    { q:"Advance tax is payable when tax liability exceeds:", opts:["Rs. 5,000","Rs. 10,000","Rs. 15,000","Rs. 25,000"], ans:1, exp:"Advance tax is payable when the estimated tax liability for the year exceeds Rs. 10,000." },
    { q:"Under Section 10(38), LTCG on equity shares was exempt up to:", opts:["AY 2017-18","AY 2018-19","AY 2019-20","AY 2020-21"], ans:1, exp:"Section 10(38) exemption was withdrawn from AY 2019-20 (FY 2018-19) by Finance Act 2018." },
    { q:"Transfer Pricing provisions apply to transactions between:", opts:["Domestic companies","Associated enterprises","Listed companies","All companies"], ans:1, exp:"Transfer pricing provisions under Sections 92-92F apply to international transactions between associated enterprises." },
    { q:"The period of limitation for assessment under Section 143(3) is:", opts:["12 months","18 months","21 months","24 months"], ans:1, exp:"Assessment under Section 143(3) must be completed within 18 months from the end of the assessment year." },
    { q:"Under DTAA, which method is used to avoid double taxation?", opts:["Exemption method only","Credit method only","Both exemption and credit methods","Neither"], ans:2, exp:"DTAAs use both exemption method (income exempt in one country) and credit method (tax credit for taxes paid abroad)." },
    { q:"Minimum Alternate Tax (MAT) is applicable to:", opts:["All assesses","Companies only","Firms only","Individuals only"], ans:1, exp:"MAT under Section 115JB is applicable only to companies." },
    { q:"The rate of MAT for domestic companies is:", opts:["10%","15%","18.5%","20%"], ans:2, exp:"MAT is levied at 15% (plus surcharge and cess) on book profits of companies." },
    { q:"Under Section 194C, TDS on payments to contractors is:", opts:["1% for individuals, 2% for others","2% for individuals, 1% for others","1% for all","2% for all"], ans:0, exp:"TDS under Section 194C is 1% for payments to individuals/HUF and 2% for others." },
    { q:"Capital gains on sale of agricultural land in rural area is:", opts:["Taxable as STCG","Taxable as LTCG","Exempt","Taxable as business income"], ans:2, exp:"Agricultural land in rural area is not a capital asset, so gains on its sale are not taxable as capital gains." },
    { q:"Under Section 80D, deduction for health insurance premium for senior citizens is:", opts:["Rs. 25,000","Rs. 50,000","Rs. 75,000","Rs. 1,00,000"], ans:1, exp:"Deduction under Section 80D for health insurance premium for senior citizens is Rs. 50,000." },
  ],
  Tax: [
    { q:"GST is a ______ tax levied on supply of goods and services.", opts:["Origin-based","Destination-based","Production-based","Export-based"], ans:1, exp:"GST is a destination-based consumption tax — revenue goes to the state where goods/services are consumed." },
    { q:"The threshold limit for GST registration for service providers is:", opts:["Rs. 20 lakhs","Rs. 40 lakhs","Rs. 10 lakhs","Rs. 50 lakhs"], ans:0, exp:"Service providers must register for GST when annual turnover exceeds Rs. 20 lakhs (Rs. 10 lakhs in special category states)." },
    { q:"IGST is levied on:", opts:["Intra-state supply","Inter-state supply","Both","Neither"], ans:1, exp:"IGST (Integrated GST) is levied on inter-state supply of goods and services." },
    { q:"The GST rate on essential food items is:", opts:["0%","5%","12%","18%"], ans:0, exp:"Essential food items like fresh vegetables, milk, and eggs are exempt from GST (0% rate)." },
    { q:"Input Tax Credit (ITC) cannot be claimed on:", opts:["Raw materials","Capital goods","Motor vehicles for personal use","Office equipment"], ans:2, exp:"ITC on motor vehicles used for personal purposes is blocked under Section 17(5) of CGST Act." },
    { q:"The time limit for filing GSTR-1 (monthly) is:", opts:["10th of next month","11th of next month","15th of next month","20th of next month"], ans:1, exp:"GSTR-1 for monthly filers must be filed by the 11th of the following month." },
    { q:"Composition scheme under GST is available for turnover up to:", opts:["Rs. 75 lakhs","Rs. 1 crore","Rs. 1.5 crore","Rs. 2 crore"], ans:2, exp:"The composition scheme is available for registered persons with aggregate turnover up to Rs. 1.5 crore." },
    { q:"Under GST, the place of supply for services related to immovable property is:", opts:["Location of supplier","Location of recipient","Location of property","Location of contract"], ans:2, exp:"For services directly related to immovable property, the place of supply is the location of the property." },
    { q:"The GST rate on restaurant services (non-AC) is:", opts:["0%","5%","12%","18%"], ans:1, exp:"Restaurant services in non-AC restaurants attract GST at 5% without ITC." },
    { q:"E-way bill is required for movement of goods exceeding:", opts:["Rs. 25,000","Rs. 50,000","Rs. 1,00,000","Rs. 2,00,000"], ans:1, exp:"E-way bill is mandatory for movement of goods where the value exceeds Rs. 50,000." },
    { q:"Under income tax, the basic exemption limit for individuals below 60 years is:", opts:["Rs. 2 lakhs","Rs. 2.5 lakhs","Rs. 3 lakhs","Rs. 5 lakhs"], ans:1, exp:"The basic exemption limit for individuals below 60 years is Rs. 2,50,000 under the old tax regime." },
    { q:"TDS under Section 194A on interest from banks is applicable when interest exceeds:", opts:["Rs. 5,000","Rs. 10,000","Rs. 40,000","Rs. 50,000"], ans:2, exp:"TDS under Section 194A is applicable when interest from banks exceeds Rs. 40,000 (Rs. 50,000 for senior citizens)." },
    { q:"The rate of CGST on gold is:", opts:["1.5%","3%","5%","12%"], ans:0, exp:"Gold attracts GST at 3% (1.5% CGST + 1.5% SGST for intra-state supply)." },
    { q:"Reverse charge mechanism under GST means:", opts:["Supplier pays tax","Recipient pays tax","Both pay tax","Government pays tax"], ans:1, exp:"Under reverse charge mechanism, the liability to pay GST shifts from the supplier to the recipient of goods/services." },
    { q:"The due date for payment of advance tax (4th installment) is:", opts:["15th December","15th March","31st March","15th June"], ans:1, exp:"The 4th and final installment of advance tax (100% of tax liability) is due by 15th March." },
  ],
  AdvAcc: [
    { q:"Under AS 14, amalgamation in the nature of merger requires:", opts:["All assets and liabilities transferred","Only assets transferred","Only liabilities transferred","Partial transfer"], ans:0, exp:"Amalgamation in the nature of merger requires all assets and liabilities of the transferor company to be taken over." },
    { q:"In the pooling of interests method, assets are recorded at:", opts:["Fair value","Book value","Cost","Market value"], ans:1, exp:"Under the pooling of interests method, assets and liabilities are recorded at their existing book values." },
    { q:"Debentures issued at discount are shown in balance sheet at:", opts:["Face value","Issue price","Redemption value","Market value"], ans:0, exp:"Debentures are shown at face value in the balance sheet; the discount is shown as a fictitious asset." },
    { q:"Under AS 22, deferred tax asset is recognised when:", opts:["There are permanent differences","There are timing differences creating future tax benefit","Always","Never"], ans:1, exp:"Deferred tax asset is recognised for deductible temporary differences to the extent it is probable that future taxable profit will be available." },
    { q:"The profit on forfeiture of shares is transferred to:", opts:["P&L Account","Capital Reserve","General Reserve","Securities Premium"], ans:1, exp:"Profit on forfeiture of shares is a capital profit and must be transferred to Capital Reserve." },
    { q:"Under AS 4, contingent liabilities are:", opts:["Recognised in books","Disclosed in notes","Ignored","Shown as provisions"], ans:1, exp:"Contingent liabilities are not recognised in the books but are disclosed in the notes to accounts." },
    { q:"Goodwill written off is debited to:", opts:["P&L Account","Capital Reserve","Goodwill Account","Partners' Capital Account"], ans:0, exp:"Goodwill written off is charged to the Profit and Loss Account as an expense." },
    { q:"In hire purchase, interest is calculated on:", opts:["Cash price","Hire purchase price","Outstanding balance","Total installments"], ans:2, exp:"Interest in hire purchase is calculated on the outstanding balance (diminishing balance method)." },
    { q:"Under AS 7, contract revenue includes:", opts:["Initial contract price only","Variations and claims","Both initial price and variations/claims","Neither"], ans:2, exp:"Contract revenue includes the initial amount agreed in the contract plus variations in contract work, claims, and incentive payments." },
    { q:"The percentage of completion method is used in:", opts:["AS 2","AS 7","AS 9","AS 11"], ans:1, exp:"AS 7 (Construction Contracts) uses the percentage of completion method to recognise revenue and expenses." },
    { q:"Under AS 13, long-term investments are carried at:", opts:["Market value","Cost less permanent diminution","Lower of cost or market value","Fair value"], ans:1, exp:"Long-term investments are carried at cost. Provision is made for permanent diminution in value." },
    { q:"Revaluation of assets in partnership is done through:", opts:["P&L Account","Revaluation Account","Capital Account","Reserve Account"], ans:1, exp:"Revaluation of assets and liabilities in partnership is done through the Revaluation Account." },
    { q:"Under AS 26, research costs are:", opts:["Capitalised","Expensed as incurred","Deferred","Amortised"], ans:1, exp:"Research costs are expensed as incurred under AS 26. Only development costs meeting specific criteria can be capitalised." },
    { q:"In branch accounting, the branch account in HO books is a:", opts:["Real account","Personal account","Nominal account","Memorandum account"], ans:1, exp:"The branch account in HO books is a personal account representing the amount owed to/by the branch." },
    { q:"Under AS 17, a segment is reportable if its revenue is at least:", opts:["5% of total revenue","10% of total revenue","15% of total revenue","20% of total revenue"], ans:1, exp:"A segment is reportable if its revenue, result, or assets constitute 10% or more of the combined totals." },
  ],
}

// Generic questions for subjects without specific bank
const GENERIC_QB = [
  { q:"Which accounting standard deals with disclosure of accounting policies?", opts:["AS 1","AS 2","AS 3","AS 4"], ans:0, exp:"AS 1 deals with Disclosure of Accounting Policies." },
  { q:"The going concern concept assumes:", opts:["Business will close soon","Business will continue indefinitely","Business is profitable","Business has no debts"], ans:1, exp:"The going concern concept assumes that the business will continue to operate for the foreseeable future." },
  { q:"Materiality concept states that:", opts:["All items must be disclosed","Only significant items need disclosure","No items need disclosure","Only assets need disclosure"], ans:1, exp:"The materiality concept states that only items that are significant enough to affect decisions need to be disclosed." },
  { q:"The accrual concept requires:", opts:["Cash basis accounting","Recognition when earned/incurred","Recognition when paid","Recognition when invoiced"], ans:1, exp:"The accrual concept requires revenues and expenses to be recognised when earned or incurred, not when cash is received or paid." },
  { q:"Depreciation is charged to:", opts:["Balance Sheet","P&L Account","Capital Account","Reserve Account"], ans:1, exp:"Depreciation is a non-cash expense charged to the Profit and Loss Account." },
  { q:"The dual aspect concept states:", opts:["Every debit has a credit","Assets = Liabilities + Capital","Both A and B","Neither"], ans:2, exp:"The dual aspect concept states that every transaction has two aspects (debit and credit) and Assets = Liabilities + Capital." },
  { q:"Under the cost concept, assets are recorded at:", opts:["Market value","Historical cost","Replacement cost","Net realisable value"], ans:1, exp:"Under the cost concept, assets are recorded at their historical cost (original purchase price)." },
  { q:"Provision for bad debts is created to:", opts:["Increase profits","Reduce tax","Provide for anticipated losses","Increase assets"], ans:2, exp:"Provision for bad debts is created to provide for anticipated losses from debtors who may not pay." },
  { q:"The matching concept requires:", opts:["Matching assets with liabilities","Matching revenues with related expenses","Matching income with capital","Matching debtors with creditors"], ans:1, exp:"The matching concept requires that expenses are matched with the revenues they help generate in the same period." },
  { q:"Bank reconciliation statement is prepared to:", opts:["Find bank balance","Reconcile cash book and bank statement","Prepare final accounts","Calculate interest"], ans:1, exp:"Bank reconciliation statement is prepared to reconcile the balance as per cash book with the balance as per bank statement." },
]

function getQuestionsForSubject(subjectId, count) {
  const bank = QB[subjectId] || GENERIC_QB
  const shuffled = [...bank].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

// --- STATE ----------------------------------------------------
let mockState = {
  questions: [],
  answers: {},
  current: 0,
  timeLeft: 0,
  totalTime: 0,
  interval: null,
  subject: '',
  startTime: null,
}

// --- INIT -----------------------------------------------------
export function initMock(goal) {
  renderSubjectOptions(goal)
  document.getElementById('startMockBtn')?.addEventListener('click', startMock)
}

function renderSubjectOptions(goal) {
  const sel = document.getElementById('mockSubject')
  if (!sel) return
  const subjects = getSubjectsForGoal(goal)
  sel.innerHTML = `<option value="">Select subject</option>` +
    subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('')
}

function startMock() {
  const subjectId = document.getElementById('mockSubject')?.value
  const qCount    = +document.getElementById('mockQCount')?.value || 10
  const diff      = document.querySelector('.diff-pill.active')?.dataset.diff || 'medium'

  if (!subjectId) {
    const err = document.getElementById('mockSetupErr')
    if (err) { err.textContent = 'Please select a subject'; err.style.display = 'block' }
    return
  }

  mockState.questions = getQuestionsForSubject(subjectId, qCount)
  mockState.answers   = {}
  mockState.current   = 0
  mockState.subject   = subjectId
  mockState.timeLeft  = qCount * 120
  mockState.totalTime = mockState.timeLeft
  mockState.startTime = Date.now()

  showPanel('mockTestPanel')
  renderQuestion()
  startMockTimer()
}

function renderQuestion() {
  const q   = mockState.questions[mockState.current]
  const idx = mockState.current
  const total = mockState.questions.length

  document.getElementById('mockProgress').textContent = `Q${idx + 1} / ${total}`
  document.getElementById('mockProgressBar').style.width = `${((idx + 1) / total) * 100}%`
  document.getElementById('mockQuestion').textContent = q.q

  const optsEl = document.getElementById('mockOptions')
  optsEl.innerHTML = q.opts.map((opt, i) => `
    <div class="mock-option ${mockState.answers[idx] === i ? 'selected' : ''}" data-idx="${i}">
      <span class="mock-opt-letter">${String.fromCharCode(65 + i)}</span>
      <span>${opt}</span>
    </div>`).join('')

  optsEl.querySelectorAll('.mock-option').forEach(el => {
    el.addEventListener('click', () => {
      mockState.answers[idx] = +el.dataset.idx
      renderQuestion()
      renderQuestionGrid()
    })
  })

  document.getElementById('mockPrev').disabled = idx === 0
  document.getElementById('mockNext').textContent = idx === total - 1 ? 'Submit' : 'Next ?'
  renderQuestionGrid()
}

function renderQuestionGrid() {
  const el = document.getElementById('mockQGrid')
  if (!el) return
  el.innerHTML = mockState.questions.map((_, i) => {
    const answered = mockState.answers[i] !== undefined
    const current  = i === mockState.current
    return `<button class="qgrid-btn ${current ? 'current' : answered ? 'answered' : ''}" data-i="${i}">${i + 1}</button>`
  }).join('')
  el.querySelectorAll('.qgrid-btn').forEach(btn => {
    btn.addEventListener('click', () => { mockState.current = +btn.dataset.i; renderQuestion() })
  })
}

function startMockTimer() {
  clearInterval(mockState.interval)
  mockState.interval = setInterval(() => {
    mockState.timeLeft--
    const m = String(Math.floor(mockState.timeLeft / 60)).padStart(2, '0')
    const s = String(mockState.timeLeft % 60).padStart(2, '0')
    const el = document.getElementById('mockTimer')
    if (el) {
      el.textContent = `${m}:${s}`
      el.className = `mock-timer ${mockState.timeLeft < 120 ? 'danger' : ''}`
    }
    if (mockState.timeLeft <= 0) submitMock()
  }, 1000)
}

export function navigateMock(dir) {
  const total = mockState.questions.length
  if (dir === 1 && mockState.current === total - 1) { submitMock(); return }
  mockState.current = Math.max(0, Math.min(total - 1, mockState.current + dir))
  renderQuestion()
}

function submitMock() {
  clearInterval(mockState.interval)
  const timeTaken = Math.round((Date.now() - mockState.startTime) / 1000)
  let correct = 0
  mockState.questions.forEach((q, i) => { if (mockState.answers[i] === q.ans) correct++ })
  const total = mockState.questions.length
  const pct   = Math.round((correct / total) * 100)
  const grade = pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D'

  saveMockResult({ subject: mockState.subject, score: correct, total, percentage: pct, timeTaken })
  document.dispatchEvent(new CustomEvent('mockCompleted'))

  showPanel('mockResultPanel')
  document.getElementById('mockScore').textContent    = `${correct} / ${total}`
  document.getElementById('mockPct').textContent      = `${pct}%`
  document.getElementById('mockGrade').textContent    = `Grade: ${grade}`
  document.getElementById('mockTimeTaken').textContent = formatTime(timeTaken)
  document.getElementById('mockCorrectBar').style.width = `${pct}%`
  document.getElementById('mockCorrectCount').textContent = `Correct: ${correct}`
  document.getElementById('mockWrongCount').textContent   = `Wrong: ${total - correct}`
}

export function reviewMock() {
  showPanel('mockReviewPanel')
  const el = document.getElementById('mockReviewList')
  if (!el) return
  el.innerHTML = mockState.questions.map((q, i) => {
    const userAns = mockState.answers[i]
    const correct = userAns === q.ans
    return `
      <div class="review-item ${correct ? 'correct' : 'wrong'}">
        <div class="review-q"><strong>Q${i + 1}.</strong> ${q.q}</div>
        ${q.opts.map((opt, j) => `
          <div class="review-opt ${j === q.ans ? 'correct-ans' : j === userAns && !correct ? 'wrong-ans' : ''}">
            ${j === q.ans ? '?' : j === userAns ? '?' : '?'} ${opt}
          </div>`).join('')}
        <div class="review-exp">?? ${q.exp}</div>
      </div>`
  }).join('')
}

function showPanel(id) {
  ['mockSetupPanel','mockTestPanel','mockResultPanel','mockReviewPanel'].forEach(p => {
    const el = document.getElementById(p)
    if (el) el.style.display = p === id ? 'block' : 'none'
  })
}

export function resetMock() { showPanel('mockSetupPanel') }

function formatTime(secs) {
  const m = Math.floor(secs / 60), s = secs % 60
  return `${m}m ${s}s`
}
