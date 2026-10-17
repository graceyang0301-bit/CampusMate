(() => {
  const STORAGE_KEY = "campusmate-demo-v1";
  const categories = [
    {id:"all",label:"全部任务",emoji:"✳"},
    {id:"快递代取",label:"快递代取",emoji:"📦"},
    {id:"食堂代买",label:"食堂代买",emoji:"🥡"},
    {id:"学习互助",label:"学习互助",emoji:"📚"},
    {id:"其他帮助",label:"其他帮助",emoji:"🌿"}
  ];
  const initialTasks = [
    {id:1,title:"帮忙从东门驿站取一下快递",category:"快递代取",desc:"一个中等大小的纸箱，取件码已准备好，送到 3 号宿舍楼下就好。",location:"东门驿站 → 3号宿舍",time:"今天 16:30 前",reward:8,owner:"陈同学",avatar:"陈",avatarClass:"",status:"open",created:"10 分钟前"},
    {id:2,title:"食堂可以帮带一份番茄鸡蛋面吗",category:"食堂代买",desc:"在二食堂窗口买一份番茄鸡蛋面，餐费我会提前转给你。",location:"二食堂",time:"今天 12:20 前",reward:5,owner:"周同学",avatar:"周",avatarClass:"a2",status:"open",created:"18 分钟前"},
    {id:3,title:"图书馆三楼帮忙留一个座位",category:"其他帮助",desc:"想找靠窗的位置复习一会儿，如果不方便也没关系～",location:"图书馆 3F",time:"今天 14:00 前",reward:4,owner:"许同学",avatar:"许",avatarClass:"a3",status:"open",created:"32 分钟前"},
    {id:4,title:"求一位同学分享高数复习笔记",category:"学习互助",desc:"准备下周的阶段测验，想对照一下第 4、5 章的重点整理。",location:"线上 / 教学楼",time:"明天 18:00 前",reward:6,owner:"林同学",avatar:"林",avatarClass:"a4",status:"open",created:"1 小时前"},
    {id:5,title:"从南门便利店带一瓶矿泉水",category:"食堂代买",desc:"普通饮用水即可，送到理科楼 A 座一楼。",location:"南门便利店 → 理科楼",time:"今天 15:00 前",reward:3,owner:"吴同学",avatar:"吴",avatarClass:"a2",status:"open",created:"1 小时前"},
    {id:6,title:"代取一份打印好的课程资料",category:"快递代取",desc:"资料在文印店前台，已付款，报手机号后四位即可领取。",location:"学生活动中心旁",time:"今天 17:30 前",reward:5,owner:"赵同学",avatar:"赵",avatarClass:"a3",status:"open",created:"2 小时前"},
    {id:7,title:"帮忙把社团海报送到活动室",category:"其他帮助",desc:"两张 A3 海报，不重，送到学生活动中心 204。",location:"艺术楼 → 活动中心",time:"明天 12:00 前",reward:4,owner:"孙同学",avatar:"孙",avatarClass:"",status:"open",created:"2 小时前"},
    {id:8,title:"一起自习，互相检查英语单词",category:"学习互助",desc:"四级词汇打卡，约 30 分钟，互相抽查就好。",location:"图书馆一楼",time:"明天 19:00",reward:6,owner:"何同学",avatar:"何",avatarClass:"a4",status:"open",created:"3 小时前"},
    {id:9,title:"帮忙取一份食堂打包的晚饭",category:"食堂代买",desc:"已经在一食堂下单，报尾号 281 即可取餐。",location:"一食堂",time:"今天 18:30 前",reward:5,owner:"郑同学",avatar:"郑",avatarClass:"a2",status:"open",created:"3 小时前"},
    {id:10,title:"帮忙从校门口拿一份文件",category:"快递代取",desc:"文件袋很轻，拿到行政楼门卫处即可。",location:"学校北门 → 行政楼",time:"明天 10:00 前",reward:7,owner:"蒋同学",avatar:"蒋",avatarClass:"a3",status:"open",created:"4 小时前"},
    {id:11,title:"求推荐适合新生的校园路线",category:"其他帮助",desc:"刚来学校，想了解从宿舍到实验楼的近路。",location:"校园内",time:"本周内",reward:3,owner:"郭同学",avatar:"郭",avatarClass:"a4",status:"open",created:"5 小时前"},
    {id:12,title:"找同学一起梳理线性代数错题",category:"学习互助",desc:"主要是矩阵和向量空间，带上自己的错题就好。",location:"教学楼 B204",time:"周五 16:00",reward:8,owner:"唐同学",avatar:"唐",avatarClass:"",status:"open",created:"昨天"}
  ];
  const initialRecords = [
    {id:101,title:"帮忙带一份打印资料",person:"周同学",direction:"given",date:"10月15日",reward:5,status:"completed",icon:"📄"},
    {id:102,title:"代取校园快递",person:"陈同学",direction:"received",date:"10月13日",reward:8,status:"completed",icon:"📦"},
    {id:103,title:"一起整理高数错题",person:"许同学",direction:"given",date:"10月10日",reward:6,status:"completed",icon:"📚"}
  ];
  const defaultState = () => ({tasks:initialTasks.map(t=>({...t})),records:initialRecords.map(r=>({...r})),accepted:[],completed:[],weeklyAccepted:2,credit:92,verified:true,profile:{name:"林同学",school:"示例大学",major:"信息管理与信息系统",year:"大二"}, nextId:200});
  let state = loadState();
  let currentPage = "home";
  let taskFilter = "all";
  let taskSearch = "";
  let helpTab = "given";

  function loadState(){
    try { const raw=localStorage.getItem(STORAGE_KEY); if(raw){const parsed=JSON.parse(raw);if(parsed&&Array.isArray(parsed.tasks)&&Array.isArray(parsed.records))return parsed;} } catch(e){}
    return defaultState();
  }
  function saveState(){ try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){} updateSidebar(); }
  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function money(n){return `${n} <small>积分</small>`;}
  function openTasks(){return state.tasks.filter(t=>t.status==="open").length;}
  function acceptedThisWeek(){return state.weeklyAccepted||0;}
  function updateSidebar(){
    const count=document.getElementById("nav-task-count");if(count)count.textContent=openTasks();
    const limit=document.getElementById("sidebar-limit");if(limit)limit.textContent=`${acceptedThisWeek()} / 5`;
    const progress=document.getElementById("sidebar-progress");if(progress)progress.style.width=`${Math.min(100,acceptedThisWeek()/5*100)}%`;
  }
  function go(page){
    currentPage=page;
    document.querySelectorAll("[data-page]").forEach(el=>{if(el.classList.contains("nav-item"))el.classList.toggle("active",el.dataset.page===page);});
    const labels={home:"首页概览",tasks:"任务大厅",publish:"发布任务",help:"我的互助",profile:"个人中心",rules:"互助公约"};
    document.getElementById("breadcrumb-current").textContent=labels[page]||"首页概览";
    document.getElementById("sidebar").classList.remove("open");
    renderPage(); window.scrollTo({top:0,behavior:"smooth"});
  }
  function pageHeading(eyebrow,title,subtitle,button=""){
    return `<div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></div>${button}</div>`;
  }
  function taskCard(t){
    const isMine=t.owner===state.profile.name;
    const cat=categories.find(c=>c.id===t.category)||{emoji:"🌿"};
    const status=t.status==="open"?'<span class="task-status open">等待帮助</span>':t.status==="accepted"?'<span class="task-status">进行中</span>':'<span class="task-status">已完成</span>';
    return `<article class="task-card"><div class="task-card-top"><span class="task-category">${cat.emoji} ${esc(t.category)}</span>${status}</div><h4>${esc(t.title)}</h4><p class="task-desc">${esc(t.desc)}</p><div class="task-meta"><span>⌖ ${esc(t.location)}</span><span>◷ ${esc(t.time)}</span></div><div class="task-card-bottom"><div class="requester"><span class="requester-avatar ${esc(t.avatarClass||"")}">${esc(t.avatar||"同")}</span><span class="requester-name">${esc(t.owner)}<small>${esc(t.created||"刚刚发布")}</small></span></div><span class="task-reward">${money(t.reward)}</span></div><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px"><button class="text-btn" data-action="detail" data-id="${t.id}">查看详情 ↗</button>${t.status==="open"&&!isMine?`<button class="primary-btn" style="padding:8px 12px" data-action="accept" data-id="${t.id}">接下任务</button>`:t.status==="accepted"&&t.acceptedBy===state.profile.name?`<button class="secondary-btn" style="padding:8px 12px" data-action="complete" data-id="${t.id}">标记完成</button>`:""}</div></article>`;
  }
  function taskCards(list){
    if(!list.length)return `<div class="empty-state"><div class="empty-icon">🌱</div><strong>这里暂时没有任务</strong><p>试试其他分类，或者发布一个互助需求。</p><button class="primary-btn" data-page="publish">＋ 发布任务</button></div>`;
    return list.map(taskCard).join("");
  }
  function categoryTiles(){
    const items=[["快递代取","📦","4 条待帮助"],["食堂代买","🥡","3 条待帮助"],["学习互助","📚","3 条待帮助"],["其他帮助","🌿","2 条待帮助"]];
    return items.map(([name,emoji,count])=>`<button class="category-tile" data-category="${name}" data-page="tasks"><span class="category-emoji">${emoji}</span><span><strong>${name}</strong><small>${count}</small></span></button>`).join("");
  }
  function homePage(){
    const recent=state.tasks.filter(t=>t.status==="open").slice(0,3);
    return `${pageHeading("MONDAY, OCTOBER 17","你好，${esc(state.profile.name)} 👋","校园里总有些小事，值得我们互相搭把手。今天也来传递一点善意吧。",'<button class="primary-btn" data-page="publish">＋ 发布一个任务</button>')}
      <section class="hero"><div class="hero-copy"><div class="hero-kicker">✦ 校园互助 · 从身边开始</div><h2>一点点帮助，<em>让校园更温暖。</em></h2><p>取一个快递、带一份午餐，或一起完成一次学习打卡。让每一次善意都有回应。</p><button class="primary-btn" data-page="tasks">去任务大厅看看 <span>→</span></button></div><div class="hero-art" aria-hidden="true"><div class="art-sun"></div><div class="art-hill"></div><div class="art-building"></div><div class="art-path"></div></div></section>
      <section class="stats-grid">
        <div class="stat-card"><div class="stat-top">今日待帮助 <span class="stat-icon green">↗</span></div><div class="stat-number">${openTasks()}</div><div class="stat-note">校园里的小小需求</div></div>
        <div class="stat-card"><div class="stat-top">累计互助次数 <span class="stat-icon yellow">✳</span></div><div class="stat-number">${Math.max(128,state.records.length+125)}</div><div class="stat-note"><b>+12%</b> 较上周持续增长</div></div>
        <div class="stat-card"><div class="stat-top">我的信用积分 <span class="stat-icon blue">◇</span></div><div class="stat-number">${state.credit}</div><div class="stat-note">保持友善，积累信任</div></div>
        <div class="stat-card"><div class="stat-top">本周剩余接单 <span class="stat-icon pink">♡</span></div><div class="stat-number">${Math.max(0,5-acceptedThisWeek())}<span style="font-size:12px;color:#8b958d;font-weight:500"> / 5</span></div><div class="stat-note">给学习和休息留一点空间</div></div>
      </section>
      <div class="section-head"><div><h3>按需求找帮助</h3><p>从一件小事开始，让互助自然发生。</p></div><button class="text-btn" data-page="tasks">全部任务 →</button></div>
      <section class="category-grid">${categoryTiles()}</section>
      <section class="task-layout"><div><div class="section-head"><div><h3>最近发布的任务</h3><p>看看附近同学有什么需要</p></div><button class="text-btn" data-page="tasks">查看全部 →</button></div><div class="task-list">${taskCards(recent)}</div></div>
      <aside class="side-stack"><div class="side-card trust-card"><h3>你的互助信用</h3><p>每一次守约完成，都会让校园互助更值得信赖。</p><div class="trust-score"><strong>${state.credit}</strong><span>/ 100 · 良好</span></div><div class="progress-track"><div class="progress-fill" style="width:${state.credit}%"></div></div><div class="trust-foot"><span>当前信用等级</span><strong>友善同行者</strong></div></div><div class="side-card"><h3>🌿 互助也要有边界</h3><p>每周最多接单 5 次。合理安排时间，先照顾好自己，再去帮助别人。</p><button class="text-btn" data-page="rules">了解互助公约 →</button></div></aside></section>`;
  }
  function tasksPage(){
    const list=state.tasks.filter(t=>(taskFilter==="all"||t.category===taskFilter)&&(t.title+" "+t.desc+" "+t.location).toLowerCase().includes(taskSearch.toLowerCase()));
    return `${pageHeading("TASK BOARD","任务大厅","发现校园里的互助需求。选择你方便完成的小事，让善意流动起来。",'<button class="primary-btn" data-page="publish">＋ 发布任务</button>')}
      <div class="filters">${categories.map(c=>`<button class="filter-chip ${taskFilter===c.id?"active":""}" data-filter="${c.id}">${c.emoji} ${c.label}</button>`).join("")}<label class="search-box"><span>⌕</span><input id="task-search" value="${esc(taskSearch)}" placeholder="搜索任务、地点或关键词…"></label></div>
      <div class="task-results-head"><span>找到 <strong>${list.length}</strong> 条相关任务</span><span>校园演示数据 · 状态实时更新</span></div>
      <div class="task-list">${taskCards(list)}</div>`;
  }
  function publishPage(){
    return `${pageHeading("SHARE A LITTLE KINDNESS","发布一个任务","把你需要的小小帮助说清楚，附近的同学就有机会伸出援手。")}
      <div class="two-column"><section class="panel"><h3 class="panel-title">任务信息</h3><p class="panel-subtitle">请填写清楚的任务内容，方便同学快速了解和判断。</p>
      <form id="publish-form"><div class="form-grid">
      <div class="field full"><label for="task-title">任务标题 *</label><input id="task-title" name="title" required maxlength="48" placeholder="例如：帮忙从东门驿站取一个快递"></div>
      <div class="field"><label for="task-category">任务分类 *</label><select id="task-category" name="category" required><option value="快递代取">📦 快递代取</option><option value="食堂代买">🥡 食堂代买</option><option value="学习互助">📚 学习互助</option><option value="其他帮助">🌿 其他帮助</option></select></div>
      <div class="field"><label for="task-reward">感谢积分 *</label><select id="task-reward" name="reward"><option value="3">3 积分</option><option value="5" selected>5 积分</option><option value="8">8 积分</option><option value="10">10 积分</option></select><span class="hint">演示用积分，不涉及真实支付。</span></div>
      <div class="field full"><label for="task-desc">任务描述 *</label><textarea id="task-desc" name="desc" required maxlength="300" placeholder="补充说明物品、注意事项或其他信息…"></textarea></div>
      <div class="field"><label for="task-location">任务地点 *</label><input id="task-location" name="location" required placeholder="例如：东门驿站 → 3号宿舍"></div>
      <div class="field"><label for="task-time">希望完成时间 *</label><input id="task-time" name="time" required placeholder="例如：今天 17:00 前"></div>
      </div><div class="form-actions"><button type="button" class="secondary-btn" data-page="tasks">取消</button><button type="submit" class="primary-btn">发布互助任务 ↗</button></div></form></section>
      <aside><div class="side-card"><h3>🌱 发布小贴士</h3><p>清楚的标题、准确的地点和合理的时间，会让你的任务更容易被同学看见。</p><div class="helper-note"><strong>友善提醒</strong>请勿发布涉及危险物品、代付大额资金或侵犯他人隐私的任务。互助应当安全、平等、彼此尊重。</div></div><div class="side-card" style="margin-top:14px"><h3>平台小约定</h3><p>所有任务均为演示数据。请勿填写真实手机号、住址或其他敏感个人信息。</p></div></aside></div>`;
  }
  function helpPage(){
    const records=state.records.filter(r=>r.direction===helpTab);
    const accepted=state.tasks.filter(t=>t.status==="accepted"&&t.acceptedBy===state.profile.name);
    return `${pageHeading("MY KINDNESS LOG","我的互助","每一次帮助都值得被记住。这里记录你付出的善意，也记录你收到的温暖。")}
      <div class="profile-stats"><div class="profile-stat"><small>我帮助过别人</small><strong>${state.records.filter(r=>r.direction==="given").length}</strong></div><div class="profile-stat"><small>别人帮助过我</small><strong>${state.records.filter(r=>r.direction==="received").length}</strong></div><div class="profile-stat"><small>进行中的任务</small><strong>${accepted.length}</strong></div></div>
      <section class="panel"><div class="tab-row"><button class="tab-btn ${helpTab==="given"?"active":""}" data-help-tab="given">我帮助过谁</button><button class="tab-btn ${helpTab==="received"?"active":""}" data-help-tab="received">谁帮助过我</button><button class="tab-btn ${helpTab==="active"?"active":""}" data-help-tab="active">进行中的任务</button></div>
      ${helpTab==="active"?(accepted.length?accepted.map(t=>`<div class="record-row"><div class="record-symbol">🤝</div><div class="record-main"><strong>${esc(t.title)}</strong><small>发布者：${esc(t.owner)} · ${esc(t.time)}</small></div><div class="record-trailing"><span class="status-pill pending">进行中</span><button class="text-btn" data-action="complete" data-id="${t.id}">完成任务</button></div></div>`).join(""):`<div class="empty-state"><div class="empty-icon">🌿</div><strong>暂时没有进行中的任务</strong><p>去任务大厅看看，也许有人正需要你的帮助。</p><button class="primary-btn" data-page="tasks">浏览任务</button></div>`):(records.length?records.map(r=>`<div class="record-row"><div class="record-symbol">${r.icon||"🤝"}</div><div class="record-main"><strong>${esc(r.title)}</strong><small>${helpTab==="given"?"我帮助了":"帮助我的同学："}${esc(r.person)} · ${esc(r.date)}</small></div><div class="record-trailing"><strong>+${r.reward} 积分</strong><small><span class="status-pill">已完成</span></small></div></div>`).join(""):`<div class="empty-state"><div class="empty-icon">🌱</div><strong>互助故事还在等待开始</strong><p>完成一次任务后，记录就会出现在这里。</p><button class="primary-btn" data-page="tasks">去看看任务</button></div>`)}</section>`;
  }
  function profilePage(){
    const used=acceptedThisWeek();
    return `${pageHeading("YOUR CAMPUS ID","个人中心","管理你的演示资料，查看互助信用与接单节奏。")}
      <div class="profile-hero"><div class="profile-large-avatar">${esc((state.profile.name||"林").slice(0,1))}</div><div style="flex:1"><h2>${esc(state.profile.name)}</h2><p>${esc(state.profile.school)} · ${esc(state.profile.major)} · ${esc(state.profile.year)}</p><span class="badge-soft">${state.verified?"✓ 校园身份已模拟认证":"○ 尚未认证"}</span></div><button class="secondary-btn" data-action="edit-profile">编辑资料</button></div>
      <div class="profile-stats"><div class="profile-stat"><small>互助信用分</small><strong>${state.credit}<span style="font-size:11px;color:#879389"> / 100</span></strong></div><div class="profile-stat"><small>已完成互助</small><strong>${state.records.length}</strong></div><div class="profile-stat"><small>身份状态</small><strong style="font-size:15px;color:#4f805a">${state.verified?"已认证":"待认证"}</strong></div></div>
      <div class="two-column"><div><section class="limit-card"><div class="limit-top"><div><h3>本周接单额度</h3><p>每周最多接单 5 次，避免过度承担。</p></div><div class="limit-number">${used}<span style="font-size:11px;color:#8d988f"> / 5 次</span></div></div><div class="limit-dots">${[1,2,3,4,5].map(n=>`<span class="limit-dot ${n<=used?"used":""}"></span>`).join("")}</div><div class="limit-caption"><span>已使用 ${used} 次</span><span>剩余 ${Math.max(0,5-used)} 次</span></div></section>
      <section class="panel"><h3 class="panel-title">校园身份认证</h3><p class="panel-subtitle">演示流程用于展示平台如何建立校园身份感，不会连接真实学校系统。</p><div class="record-row"><div class="record-symbol">🎓</div><div class="record-main"><strong>学生身份（模拟）</strong><small>${state.verified?"已完成演示认证":"尚未完成演示认证"}</small></div><button class="secondary-btn" data-action="verify">${state.verified?"查看状态":"开始认证"}</button></div></section></div>
      <div class="side-stack"><section class="side-card"><h3>信用与成长</h3><p>守约完成任务、及时沟通，会帮助你积累信用。遇到困难时，也可以通过学习成长任务重新建立互助习惯。</p><div class="trust-score" style="color:var(--green)"><strong>${state.credit}</strong><span>/ 100 · 当前信用分</span></div><button class="secondary-btn" style="width:100%" data-action="growth">查看成长任务</button></section><section class="side-card"><h3>数据管理</h3><p>演示操作保存在当前浏览器中，可随时恢复到初始状态。</p><button class="text-btn" data-action="reset">重置演示数据 ↻</button></section></div></div>`;
  }
  function rulesPage(){
    return `${pageHeading("A LITTLE AGREEMENT","校园互助公约","让帮助保持友善、平等和可持续。规则不是为了限制善意，而是为了保护每一个参与者。")}
      <div class="two-column"><section><div class="rule-list">
      <div class="rule-item"><span class="rule-number">01</span><div><strong>校园身份，彼此尊重</strong><p>平台以校园成员为服务对象。演示版提供模拟认证流程，不代表真实学校身份核验。</p></div></div>
      <div class="rule-item"><span class="rule-number">02</span><div><strong>每周最多接单 5 次</strong><p>互助应当量力而行。接单上限用于提醒大家合理安排时间，不影响正常学习与休息。</p></div></div>
      <div class="rule-item"><span class="rule-number">03</span><div><strong>及时沟通，守约完成</strong><p>接单前确认时间和地点；如遇变化，请尽早与对方沟通。完成后及时更新任务状态。</p></div></div>
      <div class="rule-item"><span class="rule-number">04</span><div><strong>信用靠行动积累</strong><p>按约完成任务、友善沟通有助于积累信用。演示版的信用分仅用于展示产品机制，不构成真实评价。</p></div></div>
      <div class="rule-item"><span class="rule-number">05</span><div><strong>学习与健康优先</strong><p>不鼓励熬夜跑腿、超负荷接单或影响课程。平台倡导适度互助，而不是以接单数量衡量价值。</p></div></div>
      <div class="rule-item"><span class="rule-number">06</span><div><strong>保护隐私与人身安全</strong><p>不要发布敏感个人信息、危险物品或不合理请求。遇到让你不舒服的任务，可以选择不接。</p></div></div>
      </div></section><aside class="side-stack"><div class="side-card trust-card"><h3>互助的意义</h3><p>我们不需要每个人都做很多，只要在力所能及的时候，愿意为身边的人多走一步。</p><div class="trust-score"><strong>1 + 1</strong><span>不止于 2</span></div></div><div class="side-card"><h3>学习成长 / 信用修复</h3><p>如果任务未能按约完成，可以通过复盘、学习时间管理小贴士等演示任务，了解如何逐步恢复信任。</p><button class="secondary-btn" style="width:100%;margin-top:14px" data-action="growth">查看成长任务</button></div></aside></div>`;
  }
  function renderPage(){
    const root=document.getElementById("page-content");
    const pages={home:homePage,tasks:tasksPage,publish:publishPage,help:helpPage,profile:profilePage,rules:rulesPage};
    root.innerHTML=(pages[currentPage]||homePage)();
    updateSidebar();
  }
  function toast(message,type=""){
    const region=document.getElementById("toast-region");const el=document.createElement("div");el.className=`toast ${type}`;el.textContent=message;region.appendChild(el);setTimeout(()=>el.remove(),3200);
  }
  function openModal(html){
    document.getElementById("modal-content").innerHTML=html;
    document.getElementById("modal-backdrop").classList.remove("hidden");
  }
  function closeModal(){document.getElementById("modal-backdrop").classList.add("hidden");}
  function taskById(id){return state.tasks.find(t=>t.id===Number(id));}
  function detailTask(id){
    const t=taskById(id);if(!t)return;
    const cat=categories.find(c=>c.id===t.category)||{emoji:"🌿"};
    openModal(`<div class="eyebrow">TASK DETAILS</div><h2 id="modal-title">${esc(t.title)}</h2><div class="modal-detail-meta"><span>${cat.emoji} ${esc(t.category)}</span><span>⌖ ${esc(t.location)}</span><span>◷ ${esc(t.time)}</span></div><p>${esc(t.desc)}</p><hr class="modal-divider"><div class="record-row"><span class="requester-avatar">${esc(t.avatar||"同")}</span><div class="record-main"><strong>发布者：${esc(t.owner)}</strong><small>${esc(t.created||"刚刚发布")} · 校园演示用户</small></div><div class="record-trailing"><strong>${t.reward} 积分</strong></div></div><p style="font-size:10px">请在接单前确认自己有时间完成任务。积分仅用于演示，不涉及真实支付。</p><div class="form-actions">${t.status==="open"&&t.owner!==state.profile.name?`<button class="primary-btn" data-action="accept" data-id="${t.id}">接受这个任务</button>`:t.status==="accepted"&&t.acceptedBy===state.profile.name?`<button class="primary-btn" data-action="complete" data-id="${t.id}">标记任务完成</button>`:`<button class="secondary-btn" data-action="modal-close">关闭</button>`}</div>`);
  }
  function acceptTask(id){
    const t=taskById(id);if(!t)return;
    if(t.owner===state.profile.name){toast("这是你自己发布的任务，不能接自己的单。","error");return;}
    if(t.status!=="open"){toast("这个任务已经被接下啦。","error");return;}
    if(acceptedThisWeek()>=5){toast("本周接单额度已用完，记得给学习和休息留时间。","error");return;}
    t.status="accepted";t.acceptedBy=state.profile.name;t.acceptedAt=new Date().toISOString();state.weeklyAccepted=acceptedThisWeek()+1;state.accepted=state.accepted||[];state.accepted.push(t.id);saveState();closeModal();renderPage();toast("接单成功！完成后记得更新任务状态。");
  }
  function completeTask(id){
    const t=taskById(id);if(!t||t.status!=="accepted"||t.acceptedBy!==state.profile.name){toast("当前任务无法由你完成。","error");return;}
    t.status="completed";state.completed=state.completed||[];state.completed.push(t.id);state.credit=Math.min(100,state.credit+2);
    state.records.unshift({id:state.nextId++,title:t.title,person:t.owner,direction:"given",date:"刚刚",reward:t.reward,status:"completed",icon:"🤝"});
    saveState();closeModal();renderPage();toast("任务已标记完成，互助记录与信用分已更新！");
  }
  function verifyDemo(){
    openModal(`<div class="eyebrow">CAMPUS ID · DEMO</div><h2 id="modal-title">校园身份认证</h2><p>这是用于展示产品流程的模拟认证，不会连接学校系统，也不会验证真实学籍。</p><div class="field" style="margin-top:18px"><label for="demo-school">学校名称</label><input id="demo-school" value="${esc(state.profile.school)}" maxlength="40"></div><div class="field" style="margin-top:13px"><label for="demo-student">学生称呼</label><input id="demo-student" value="${esc(state.profile.name)}" maxlength="20"></div><div class="helper-note"><strong>隐私提示</strong>请勿在演示版输入真实学号、密码或身份证号码。</div><div class="form-actions"><button class="secondary-btn" data-action="modal-close">取消</button><button class="primary-btn" data-action="confirm-verify">确认演示认证</button></div>`);
  }
  function editProfile(){
    openModal(`<div class="eyebrow">YOUR PROFILE</div><h2 id="modal-title">编辑个人资料</h2><form id="profile-form"><div class="field" style="margin-top:18px"><label for="profile-name">称呼</label><input id="profile-name" name="name" value="${esc(state.profile.name)}" required maxlength="20"></div><div class="field" style="margin-top:13px"><label for="profile-major">专业</label><input id="profile-major" name="major" value="${esc(state.profile.major)}" required maxlength="40"></div><div class="field" style="margin-top:13px"><label for="profile-year">年级</label><select id="profile-year" name="year">${["大一","大二","大三","大四","研究生"].map(y=>`<option ${state.profile.year===y?"selected":""}>${y}</option>`).join("")}</select></div><div class="form-actions"><button type="button" class="secondary-btn" data-action="modal-close">取消</button><button type="submit" class="primary-btn">保存资料</button></div></form>`);
  }
  function growthModal(){
    openModal(`<div class="eyebrow">LEARNING & GROWTH</div><h2 id="modal-title">学习成长任务</h2><p>互助平台不只记录结果，也鼓励大家复盘和成长。以下是演示任务，不会影响真实学籍或信用记录。</p><div class="record-row"><div class="record-symbol">🗓️</div><div class="record-main"><strong>做一次时间安排复盘</strong><small>回顾本周学习、休息与互助的时间分配</small></div><span class="status-pill">5 分钟</span></div><div class="record-row"><div class="record-symbol">🤝</div><div class="record-main"><strong>阅读友善沟通小贴士</strong><small>练习在任务变化时及时沟通</small></div><span class="status-pill">3 分钟</span></div><div class="record-row"><div class="record-symbol">📚</div><div class="record-main"><strong>设定一个学习优先目标</strong><small>先安排课程与休息，再决定是否接单</small></div><span class="status-pill">2 分钟</span></div><div class="form-actions"><button class="primary-btn" data-action="finish-growth">完成一次成长打卡</button></div>`);
  }
  function resetDemo(){
    openModal(`<div class="eyebrow">RESET DEMO</div><h2 id="modal-title">恢复初始演示数据？</h2><p>这会清除当前浏览器中 CampusMate 保存的演示操作，并恢复初始任务、记录与积分。此操作无法撤销。</p><div class="form-actions"><button class="secondary-btn" data-action="modal-close">取消</button><button class="primary-btn" data-action="confirm-reset">确认重置</button></div>`);
  }
  document.addEventListener("click",e=>{
    const page=e.target.closest("[data-page]");if(page){e.preventDefault();go(page.dataset.page);if(page.dataset.category){taskFilter=page.dataset.category;go("tasks");}return;}
    const filter=e.target.closest("[data-filter]");if(filter){taskFilter=filter.dataset.filter;renderPage();return;}
    const tab=e.target.closest("[data-help-tab]");if(tab){helpTab=tab.dataset.helpTab;renderPage();return;}
    const action=e.target.closest("[data-action]");if(!action)return;
    const id=action.dataset.id;
    switch(action.dataset.action){
      case "detail":detailTask(id);break;
      case "accept":acceptTask(id);break;
      case "complete":completeTask(id);break;
      case "modal-close":closeModal();break;
      case "verify":verifyDemo();break;
      case "confirm-verify":{
        const school=document.getElementById("demo-school").value.trim();const name=document.getElementById("demo-student").value.trim();
        if(!school||!name){toast("请填写学校名称和学生称呼。","error");break;}
        state.profile.school=school;state.profile.name=name;state.verified=true;saveState();closeModal();renderPage();toast("演示认证完成！这不代表真实学校身份核验。");break;
      }
      case "edit-profile":editProfile();break;
      case "growth":growthModal();break;
      case "finish-growth":state.credit=Math.min(100,state.credit+1);saveState();closeModal();renderPage();toast("成长打卡完成！演示信用分 +1。");break;
      case "reset":resetDemo();break;
      case "confirm-reset":state=defaultState();saveState();taskFilter="all";taskSearch="";helpTab="given";closeModal();go("home");toast("演示数据已恢复初始状态。");break;
    }
  });
  document.addEventListener("submit",e=>{
    if(e.target.id==="publish-form"){
      e.preventDefault();const fd=new FormData(e.target);const title=String(fd.get("title")||"").trim();const desc=String(fd.get("desc")||"").trim();const location=String(fd.get("location")||"").trim();const time=String(fd.get("time")||"").trim();
      if(!title||!desc||!location||!time){toast("请填写所有必填字段。","error");return;}
      const id=state.nextId++;const task={id,title,category:String(fd.get("category")),desc,location,time,reward:Number(fd.get("reward"))||5,owner:state.profile.name,avatar:(state.profile.name||"同").slice(0,1),avatarClass:"",status:"open",created:"刚刚发布"};
      state.tasks.unshift(task);saveState();taskFilter="all";taskSearch="";go("tasks");toast("任务发布成功！现在可以在任务大厅查看。");
    }
    if(e.target.id==="profile-form"){
      e.preventDefault();const fd=new FormData(e.target);const name=String(fd.get("name")||"").trim();const major=String(fd.get("major")||"").trim();const year=String(fd.get("year")||"大二");
      if(!name||!major){toast("请填写称呼和专业。","error");return;}
      state.profile.name=name;state.profile.major=major;state.profile.year=year;saveState();closeModal();renderPage();toast("个人资料已保存。");
    }
  });
  document.addEventListener("input",e=>{
    if(e.target.id==="task-search"){const pos=e.target.selectionStart;taskSearch=e.target.value;const root=document.getElementById("page-content");const old=root.querySelector("#task-search");const list=state.tasks.filter(t=>(taskFilter==="all"||t.category===taskFilter)&&(t.title+" "+t.desc+" "+t.location).toLowerCase().includes(taskSearch.toLowerCase()));const result=root.querySelector(".task-results-head");if(result)result.innerHTML=`<span>找到 <strong>${list.length}</strong> 条相关任务</span><span>校园演示数据 · 状态实时更新</span>`;const taskList=root.querySelector(".task-list");if(taskList)taskList.innerHTML=taskCards(list);const newInput=root.querySelector("#task-search");if(newInput){newInput.focus();newInput.setSelectionRange(pos,pos);}}
  });
  document.getElementById("mobile-menu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
  document.getElementById("notice-btn").addEventListener("click",()=>openModal(`<div class="eyebrow">CAMPUSMATE NOTES</div><h2 id="modal-title">小小提醒</h2><div class="notice-list"><div class="notice-item"><strong>🌿 互助也要适度</strong>本周最多接单 5 次，请为学习和休息留出时间。</div><div class="notice-item"><strong>🔒 保护个人信息</strong>当前为演示平台，不要填写真实学号、密码或敏感资料。</div><div class="notice-item"><strong>🤝 友善沟通</strong>如果任务时间或地点有变化，请及时与对方确认。</div></div>`));
  document.getElementById("modal-close").addEventListener("click",closeModal);
  document.getElementById("modal-backdrop").addEventListener("click",e=>{if(e.target.id==="modal-backdrop")closeModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
  renderPage();
})();