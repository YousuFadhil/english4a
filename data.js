/* بيانات الدروس: كتاب Team Together - Oman Class 4A (الوحدة 1 والوحدة 2)
   أرقام الصفحات = الأرقام المطبوعة على الورقة. */
(function () {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const E = (e) => ({ e });
  const T = (t) => ({ t });
  const W = (en, ar, pic, x) => Object.assign({ id: slug(en), en, ar, pic }, x || {});
  const R = (id, x) => Object.assign({ ref: id }, x || {});
  const S = (en, ar) => ({ id: 's_' + slug(en).slice(0, 48), en, ar });
  const clock = (h, m) => ({ svg: 'clock', h, m });
  const week = (on, x) => Object.assign({ svg: 'week', on }, x || {});
  const cont = (c, col, e) => ({ svg: 'cont', c, col, e: e || '' });
  const P = (en, ar, pic, parts, hl) => W(en, ar, pic, { parts, hl: hl || [] });

  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const units = [
    {
      id: 'u1', no: 1, name: 'New school', ar: 'مدرسة جديدة', pages: '١٤–٣٥',
      lessons: [
        { id: 'u1l1', kind: 'vocab', ar: 'كلمات المدرسة', pages: 'ص ١٤–١٥', icon: '🏫',
          words: [
            W('Maths', 'الرياضيات', E('➗')),
            W('Science', 'العلوم', E('🌱')),
            W('Arabic', 'اللغة العربية', T('ع')),
            W('English', 'اللغة الإنجليزية', T('ABC')),
            W('Social Studies', 'الدراسات الاجتماعية', E('🌍')),
            W('P.E.', 'التربية البدنية', E('⚽')),
            W('ICT', 'تقنية المعلومات', E('💻')),
            W('Art', 'التربية الفنية', E('🎨')),
            W('Islamic Studies', 'التربية الإسلامية', E('🕌')),
            W('science lab', 'مختبر العلوم', E('🧪')),
            W('headteacher', 'مدير/ة المدرسة', E('👩‍💼')),
            W('school nurse', 'ممرضة المدرسة', E('👩‍⚕️')),
          ], sentences: [] },
        { id: 'u1l2', kind: 'vocab', ar: 'القصة: أول يوم', pages: 'ص ١٦–١٧', icon: '📖',
          words: [
            W('nervous', 'متوتر / قلق', E('😰')),
            W('classroom', 'الفصل', E('🏫')),
            W('lessons', 'الحصص', E('📚')),
            W('noise', 'ضوضاء', E('🔊')),
            W('robot', 'روبوت', E('🤖')),
            W('problem', 'مشكلة', E('⚠️')),
          ],
          sentences: [
            S("Don't worry, I'm fine!", 'لا تقلق، أنا بخير!'),
            S('Welcome to the school, Lottie!', 'أهلاً بك في المدرسة يا لوتي!'),
            S('We have English there at half past eight.', 'عندنا اللغة الإنجليزية هناك الساعة الثامنة والنصف.'),
          ] },
        { id: 'u1l3', kind: 'vocab', ar: 'الوقت وأيام الأسبوع', pages: 'ص ١٨', icon: '🕒',
          words: [
            ...DAYS.map((d, i) => W(d, DAYS_AR[i], week([i], { day: true }))),
            W("o'clock", 'الساعة تماماً', clock(3, 0)),
            W('quarter past', 'والربع', clock(3, 15)),
            W('half past', 'والنصف', clock(3, 30)),
            W('quarter to', 'إلا ربعاً', clock(2, 45)),
          ],
          sentences: [
            S('I have Science at quarter past eleven.', 'عندي العلوم الساعة الحادية عشرة والربع.'),
            S("Azza doesn't have P.E. at quarter to ten on Wednesdays.", 'عزّة ليس عندها تربية بدنية الساعة العاشرة إلا ربعاً أيام الأربعاء.'),
            S('When do we have Maths?', 'متى عندنا الرياضيات؟'),
            S('We have Maths on Tuesdays at half past ten.', 'عندنا الرياضيات أيام الثلاثاء الساعة العاشرة والنصف.'),
          ] },
        { id: 'u1l4', kind: 'vocab', ar: 'كم مرة؟', pages: 'ص ١٩', icon: '📅',
          words: [
            W('always', 'دائماً', week([0, 1, 2, 3, 4, 5, 6])),
            W('often', 'غالباً', week([0, 1, 2, 3, 4])),
            W('sometimes', 'أحياناً', week([0, 2, 4])),
            W('never', 'أبداً', week([], { never: true })),
            W('every day', 'كل يوم', week([0, 1, 2, 3, 4, 5, 6])),
            W('once a week', 'مرة في الأسبوع', week([3])),
            W('twice a week', 'مرتين في الأسبوع', week([1, 4])),
            W('three times a week', 'ثلاث مرات في الأسبوع', week([0, 2, 4])),
            W('at the weekend', 'في نهاية الأسبوع', week([5, 6])),
          ],
          sentences: [
            S('Joory plays tennis twice a week.', 'جوري تلعب التنس مرتين في الأسبوع.'),
            S('I do my homework every day.', 'أحلّ واجبي كل يوم.'),
            S('She is always busy.', 'هي دائماً مشغولة.'),
            S('He always eats fish for lunch.', 'هو دائماً يأكل السمك على الغداء.'),
          ] },
        { id: 'u1l5', kind: 'vocab', ar: 'مدارس غريبة', pages: 'ص ٢٠', icon: '🌍',
          words: [
            W('boat', 'قارب', E('⛵')),
            W('floods', 'فيضانات', E('🌊')),
            W('computers', 'حواسيب', E('🖥️')),
            W('nature', 'الطبيعة', E('🌳')),
            W('leaves', 'أوراق الشجر', E('🍃')),
            W('boarding school', 'مدرسة داخلية', E('🛏️')),
          ], sentences: [] },
        { id: 'u1l6', kind: 'sentences', ar: 'نتفق على موعد', pages: 'ص ٢١', icon: '🤝',
          words: [],
          sentences: [
            S('Do you want to play football tomorrow morning?', 'هل تريد أن تلعب كرة القدم غداً صباحاً؟'),
            S("Sorry, I can't.", 'آسف، لا أستطيع.'),
            S("I'm not free.", 'أنا مشغول.'),
            S('What about Saturday?', 'وماذا عن يوم السبت؟'),
            S("Let's meet at quarter to five in the park.", 'لنلتقِ الساعة الخامسة إلا ربعاً في الحديقة.'),
          ] },
        { id: 'u1l7', kind: 'phonics', ar: 'الأصوات: ie · igh · i-e · y', pages: 'ص ٢٤', icon: '🔤',
          groups: ['ie', 'igh', 'i-e', 'y'],
          words: [
            P('pie', 'فطيرة', E('🥧'), ['p', 'ie'], [1]),
            P('tie', 'ربطة عنق', E('👔'), ['t', 'ie'], [1]),
            P('night', 'ليل', E('🌙'), ['n', 'igh', 't'], [1]),
            P('light', 'ضوء / مصباح', E('💡'), ['l', 'igh', 't'], [1]),
            P('kite', 'طائرة ورقية', E('🪁'), ['k', 'i', 't', 'e'], [1, 3]),
            P('bike', 'دراجة', E('🚲'), ['b', 'i', 'k', 'e'], [1, 3]),
            P('fly', 'يطير', E('🕊️'), ['f', 'l', 'y'], [2]),
            P('shy', 'خجول', E('🙈'), ['sh', 'y'], [1]),
            P('cry', 'يبكي', E('😭'), ['cr', 'y'], [1]),
            P('dry', 'جاف', E('🏜️'), ['dr', 'y'], [1]),
            P('fry', 'يقلي', E('🍳'), ['fr', 'y'], [1]),
            W('bye', 'مع السلامة', E('👋'), { tricky: true }),
            W('my', 'لي / ملكي', null, { tricky: true }),
          ],
          sentences: [
            S('Every night, I eat a pie and fly a kite.', 'كل ليلة آكل فطيرة وأطيّر طائرة ورقية.'),
          ] },
        { id: 'u1l8', kind: 'review', ar: 'مراجعة الوحدة ١', pages: 'ص ٢٥–٢٧', icon: '⭐', words: [], sentences: [] },
      ],
    },
    {
      id: 'u2', no: 2, name: 'Picnic time!', ar: 'وقت النزهة', pages: '٣٦–٥٧',
      lessons: [
        { id: 'u2l1', kind: 'vocab', ar: 'الأكل والشرب', pages: 'ص ٣٦–٣٧', icon: '🍎',
          words: [
            W('fruit', 'فواكه', E('🍎🍌')),
            W('vegetables', 'خضروات', E('🥕')),
            W('sandwiches', 'سندويشات', E('🥪')),
            W('cereal', 'رقائق الإفطار', E('🥣')),
            W('noodles', 'نودلز', E('🍜')),
            W('milkshake', 'ميلك شيك', E('🥛🍓')),
            W('crisps', 'شيبس', E('🍟')),
            W('cupcakes', 'كب كيك', E('🧁')),
            W('salad', 'سلطة', E('🥗')),
            W('tea', 'شاي', E('🍵')),
            W('coffee', 'قهوة', E('☕')),
            W('lemonade', 'عصير ليمون', E('🍋🥤')),
            W('sweet', 'حلو', E('🍭')),
            W('savoury', 'مالح / غير حلو', E('🧂')),
          ], sentences: [] },
        { id: 'u2l2', kind: 'vocab', ar: 'القصة: فريق الاكتشاف', pages: 'ص ٣٨–٣٩', icon: '📖',
          words: [
            W('picnic', 'نزهة', E('🧺')),
            W('cheese', 'جبن', E('🧀')),
            W('bread', 'خبز', E('🍞')),
            W('lemons', 'ليمون', E('🍋')),
            W('shed', 'كوخ', E('🛖')),
            W('team', 'فريق', E('🧑‍🤝‍🧑')),
            W('symbol', 'رمز', E('🔰')),
          ],
          sentences: [
            S("Let's have the picnic in my garden!", 'لنقم بالنزهة في حديقتي!'),
            S("There isn't any bread!", 'لا يوجد أي خبز!'),
            S('Lemonade comes from lemons!', 'عصير الليمون يُصنع من الليمون!'),
          ] },
        { id: 'u2l3', kind: 'sentences', ar: 'كثير وقليل', pages: 'ص ٤٠', icon: '🧮',
          words: [],
          sentences: [
            S('There are a lot of noodles, some crisps and a few sandwiches.', 'يوجد الكثير من النودلز وبعض الشيبس وقليل من السندويشات.'),
            S('There is a lot of salad, some coffee and a little lemonade.', 'يوجد الكثير من السلطة وبعض القهوة وقليل من عصير الليمون.'),
            S("There aren't any cupcakes.", 'لا يوجد أي كب كيك.'),
            S("There isn't any bread.", 'لا يوجد أي خبز.'),
          ] },
        { id: 'u2l4', kind: 'vocab', ar: 'علبة، زجاجة، كوب…', pages: 'ص ٤١', icon: '🥫',
          words: [
            W('a can of lemonade', 'علبة عصير ليمون', cont('can', '#f7e463')),
            W('a bottle of water', 'زجاجة ماء', cont('bottle', '#7cc5ef')),
            W('a bowl of soup', 'صحن شوربة', cont('bowl', '#f0a05a')),
            W('a cup of coffee', 'فنجان قهوة', cont('cup', '#8a5a3c')),
            W('a glass of milk', 'كأس حليب', cont('glass', '#fffaf0')),
            W('a plate of sandwiches', 'طبق سندويشات', cont('plate', '#ffffff', '🥪')),
            W('a box of cereal', 'علبة رقائق', cont('box', '#f3c26b', '🥣')),
            W('a bag of fruit', 'كيس فواكه', cont('bag', '#e9d7b5', '🍎')),
          ],
          sentences: [
            S("There's a bag of apples.", 'يوجد كيس تفاح.'),
            S('There are two cups of coffee.', 'يوجد فنجانان من القهوة.'),
            S('Are there any apples?', 'هل يوجد تفاح؟'),
            S('Is there any coffee?', 'هل يوجد قهوة؟'),
          ] },
        { id: 'u2l5', kind: 'vocab', ar: 'أكلات حول العالم', pages: 'ص ٤٢', icon: '🍣',
          words: [
            W('sushi', 'سوشي', E('🍣')),
            W('rice', 'أرز', E('🍚')),
            W('fish', 'سمك', E('🐟')),
            W('chopsticks', 'عيدان الطعام', E('🥢')),
            W('spoon', 'ملعقة', E('🥄')),
            W('fondue', 'فوندو', E('🫕')),
            W('bubble tea', 'شاي الفقاعات', E('🧋')),
          ], sentences: [] },
        { id: 'u2l6', kind: 'vocab', ar: 'نتسوّق للأكل', pages: 'ص ٤٣', icon: '🛒',
          words: [
            W('apples', 'تفاح', E('🍏')),
            W('oranges', 'برتقال', E('🍊')),
            W('grapes', 'عنب', E('🍇')),
          ],
          sentences: [
            S('Can I have six apples, please?', 'هل أستطيع أن آخذ ستّ تفاحات من فضلك؟'),
            S('Can I have four oranges and some grapes, please?', 'هل أستطيع أن آخذ أربع برتقالات وبعض العنب من فضلك؟'),
            S('Here you are! Anything else?', 'تفضّل! أي شيء آخر؟'),
            S("No, that's it, thanks!", 'لا، هذا كل شيء، شكراً!'),
            S("That's four rials, please.", 'هذا أربعة ريالات من فضلك.'),
          ] },
        { id: 'u2l7', kind: 'phonics', ar: 'الأصوات: oa · o-e · ow', pages: 'ص ٤٦', icon: '🔤',
          groups: ['oa', 'o-e', 'ow'],
          words: [
            R('boat', { parts: ['b', 'oa', 't'], hl: [1] }),
            P('goat', 'ماعز', E('🐐'), ['g', 'oa', 't'], [1]),
            P('soap', 'صابون', E('🧼'), ['s', 'oa', 'p'], [1]),
            P('nose', 'أنف', E('👃'), ['n', 'o', 's', 'e'], [1, 3]),
            P('rose', 'وردة', E('🌹'), ['r', 'o', 's', 'e'], [1, 3]),
            P('snow', 'ثلج', E('❄️'), ['sn', 'ow'], [1]),
            P('grow', 'ينمو', E('🪴'), ['gr', 'ow'], [1]),
            P('slow', 'بطيء', E('🐌'), ['sl', 'ow'], [1]),
            P('bow', 'فيونكة', E('🎀'), ['b', 'ow'], [1]),
            P('blow', 'ينفخ', E('💨'), ['bl', 'ow'], [1]),
            W('any', 'أي (في الأسئلة والنفي)', null, { tricky: true }),
          ],
          sentences: [
            S("I'm in a boat and there's snow on my nose!", 'أنا في قارب وهناك ثلج على أنفي!'),
          ] },
        { id: 'u2l8', kind: 'review', ar: 'مراجعة الوحدة ٢', pages: 'ص ٤٧–٤٩', icon: '⭐', words: [], sentences: [] },
      ],
    },
  ];

  // تجميع: فهرس الكلمات والدروس
  const wordsById = {};
  const sentencesById = {};
  const lessons = [];
  units.forEach((u, ui) => {
    u.lessons.forEach((l) => {
      l.unitIndex = ui;
      l.unit = u;
      l.index = lessons.length;
      l.words = l.words.map((w) => {
        if (w.ref) {
          const base = wordsById[w.ref];
          const copy = Object.assign({}, base, w, { id: base.id });
          delete copy.ref;
          return copy;
        }
        w.lessonId = l.id;
        wordsById[w.id] = w;
        return w;
      });
      l.sentences.forEach((s) => { s.lessonId = l.id; sentencesById[s.id] = s; });
      lessons.push(l);
    });
  });

  window.DATA = { units, lessons, wordsById, sentencesById };
})();
