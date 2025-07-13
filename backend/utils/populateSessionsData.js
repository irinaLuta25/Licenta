const { User, Employee, Specialist, Interval, TherapySession, db } = require('../models');
const bcrypt = require('bcryptjs');
const { fakerRO: faker } = require('@faker-js/faker');

const DEPARTMENTS = ['Resurse Umane', 'Financiar', 'Marketing', 'IT'];
const FORMATIONS = ['CBT', 'Psihanaliza', 'Sistemica', 'Experientiala'];
const STYLES = ['Directiv', 'Non-Directiv', 'Empatic','Explorator','Orientat pe obiective'];
const GENDERS = ['masculin', 'feminin', 'altul'];

function randomDateInPastMonths(months = 3) {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - months);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomTimeSlot() {
  const startHour = 8 + Math.floor(Math.random() * 8);
  const begin = `${startHour}:00:00`;
  const end = `${startHour + 1}:00:00`;
  return [begin, end];
}

function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

(async () => {
  try {
    await db.sync({ force: true });
    const passwordHash = await bcrypt.hash('Parola123', 10);

    const specialists = [];
    const employees = [];

    for (let i = 0; i < 30; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = `${removeDiacritics(firstName)}.${removeDiacritics(lastName)}@gmail.com`;

      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber: faker.phone.number('+40 7## ### ###'),
        birthdate: faker.date.past({ years: 25, refDate: '2000-01-01' }),
        gender: faker.helpers.arrayElement(GENDERS),
        password: passwordHash,
        role: 'specialist',
        profileImage: null,
      });



      const specialistDescriptions = [
  "Sunt psihoterapeut cu experiență în lucrul cu persoane care se confruntă cu anxietate, stres și dificultăți în relațiile personale. Lucrez într-o manieră integrativă, adaptând tehnicile la nevoile fiecărui client. În cadrul ședințelor, pun accent pe crearea unui spațiu sigur, empatic și confidențial, unde clientul se poate simți ascultat și sprijinit.",
  "Am o formare în terapia cognitiv-comportamentală și sunt pasionat de sprijinirea clienților în gestionarea gândurilor negative și dezvoltarea abilităților de coping. Folosesc tehnici bazate pe dovezi științifice pentru a ajuta oamenii să-și depășească blocajele emoționale și să-și îmbunătățească calitatea vieții. Cred în relația de colaborare dintre terapeut și client.",
  "Lucrez de peste 10 ani în domeniul sănătății mintale și cred cu tărie că relația terapeutică este fundamentul procesului de vindecare. Am o abordare caldă, empatică și orientată spre rezultate. Integrez metode din psihoterapia sistemică și cognitiv-comportamentală, în funcție de nevoile fiecărui client.",
  "Sunt specializat în psihoterapia sistemică și ofer sprijin pentru probleme familiale, conflicte de cuplu și dificultăți de comunicare. Terapia este pentru mine un proces activ, în care ajut clienții să descopere perspective noi și să construiască relații sănătoase. Pun accent pe resursele personale ale fiecărui individ.",
  "Cred în potențialul fiecărui individ de a-și găsi echilibrul interior și folosesc o abordare empatică și bazată pe respect. Am experiență în lucrul cu persoane aflate în perioade de tranziție, cum ar fi divorțul, schimbările profesionale sau pierderea unei persoane dragi. Terapia este un parteneriat în care fiecare pas contează.",
  "Terapia este un spațiu sigur unde clientul își poate exprima liber emoțiile. Sunt aici să ascult și să ghidez procesul de autocunoaștere. Formarea mea în psihoterapia integrativă îmi permite să combin tehnici variate, adaptate la unicitatea fiecărei persoane. Lucrez cu adulți și tineri în sesiuni individuale sau de cuplu.",
  "Experiența mea include lucrul cu adolescenți și adulți, în special pe teme de identitate, stimă de sine și relații disfuncționale. Am o abordare blândă, dar fermă, și încurajez dezvoltarea autonomiei și responsabilității personale. În cadrul ședințelor, învățăm să privim dificultățile dintr-un unghi nou.",
  "Sunt formată în psihanaliză și pun accent pe explorarea inconștientului și înțelegerea mecanismelor profunde ale comportamentului uman. Îmi place să construiesc relații terapeutice de durată, bazate pe încredere și continuitate. Cred în puterea introspecției și a procesului de descoperire de sine.",
  "Folosesc tehnici validate științific și creez un cadru de susținere pentru dezvoltarea personală și emoțională. Am o abordare activă și colaborez strâns cu clienții pentru a stabili obiective clare. Consider că fiecare pas făcut în terapie este un act de curaj și o investiție în sine.",
  "Abordarea mea este centrată pe client, într-un mediu empatic și fără judecată. Lucrez pentru a construi o relație autentică și de încredere, în care clientul să se simtă văzut și acceptat. Experiența mea acoperă probleme precum anxietatea, burnoutul, dificultățile în luarea deciziilor și lipsa motivației.",
  "Lucrez ca psihoterapeut integrativ, combinând elemente din psihoterapia cognitivă, sistemică și experiențială. Văd procesul terapeutic ca o călătorie comună, în care clientul își explorează trecutul pentru a înțelege mai bine prezentul și a crea viitorul dorit. Ofer sprijin autentic și intervenții adaptate.",
  "Am o formare solidă în terapia sistemică și cred în forța relațiilor interumane în procesul de vindecare. Fie că este vorba de conflicte de cuplu, tensiuni familiale sau dificultăți în mediul profesional, abordez fiecare caz cu respect, claritate și deschidere față de nevoile clientului.",
  "Sunt psiholog clinician și psihoterapeut cognitiv-comportamental. Cred în abordările structurate, dar flexibile, care oferă clienților instrumentele necesare pentru a-și gestiona mai eficient viața de zi cu zi. Ofer sprijin în tulburări de anxietate, depresie și gestionarea stresului.",
  "Pun mare accent pe validarea emoțiilor și crearea unei relații de încredere cu clientul. Experiența mea în domeniul resurselor umane mă ajută să înțeleg mai bine provocările din mediul organizațional și să ofer intervenții eficiente pentru burnout, lipsa motivației sau conflicte la locul de muncă.",
  "Am o formare în psihoterapia integrativă și o pasiune pentru învățarea continuă. Lucrez cu adulți care se confruntă cu diverse blocaje emoționale și îi ajut să-și clarifice nevoile, valorile și obiectivele. Folosesc metode creative și personalizate pentru a susține procesul de transformare.",
  "Terapia înseamnă conectare, încredere și creștere. Mă străduiesc să creez un spațiu în care clientul să se simtă auzit și valorizat. Abordarea mea este flexibilă, bazată pe empatie, umor și curiozitate față de povestea unică a fiecărei persoane care îmi trece pragul.",
  "Am experiență în lucrul cu persoane aflate în tranziții majore de viață: divorț, pierderi, schimbări de carieră. În ședințe, încurajez reflecția, asumarea responsabilității și explorarea alternativelor. Consider că fiecare dificultate poate deveni o oportunitate de dezvoltare.",
  "În activitatea mea folosesc elemente din mindfulness, ACT și CBT. Lucrez în special cu tineri adulți care se confruntă cu stres academic, perfecționism sau incertitudini legate de viitor. Terapia este un cadru de experimentare și consolidare a unor noi moduri de relaționare cu sinele.",
  "Fiecare client vine cu o poveste unică, iar scopul meu este să-l ajut să o înțeleagă mai profund. Cred în procesul de autocunoaștere și în impactul pozitiv al relației terapeutice asupra vindecării. Ofer ghidaj și încurajare în momentele de impas emoțional.",
  "Lucrez cu clienți care se confruntă cu depresie, anxietate, atacuri de panică sau dificultăți în gestionarea emoțiilor. În ședințe, folosesc intervenții bazate pe dovezi și ofer un cadru sigur, în care clientul se poate exprima liber. Însoțesc procesul de schimbare cu respect și empatie.",
  "Cred în schimbarea profundă care poate apărea atunci când o persoană este ascultată cu adevărat. Am o formare în terapie sistemică și cred în importanța contextului familial și social în care trăim. Lucrez cu adolescenți și părinți în sesiuni individuale și de familie.",
  "Terapia este un proces viu, iar relația terapeutică este o parte esențială din el. Creez o atmosferă caldă și empatică, unde clientul se poate simți în siguranță să exploreze vulnerabilitățile. Ofer sprijin în dezvoltarea resurselor interne și găsirea unui sens personal.",
  "Experiența mea cu clienți din medii variate m-a învățat că fiecare are ritmul său. Nu forțez schimbarea, ci o încurajez, oferind răbdare, înțelegere și unelte adaptate. Lucrez cu persoane care au dificultăți în gestionarea furiei, a rușinii și a vinovăției.",
  "Abordarea mea terapeutică este colaborativă și orientată spre obiective clare. Împreună cu clientul, stabilim pași concreți și evaluăm progresul. Cred în transparență, onestitate și adaptarea intervențiilor în funcție de feedbackul constant al persoanei.",
  "Folosesc o combinație de tehnici din psihoterapia cognitivă și terapia focalizată pe compasiune. Îi ajut pe clienți să-și îmbunătățească relația cu sine și cu ceilalți. Mă implic activ în proces și sprijin oamenii să-și dezvolte capacitatea de autoreglare emoțională.",
  "În terapie, îmi propun să construiesc o relație autentică, bazată pe încredere și sprijin. Lucrez cu persoane care se confruntă cu dificultăți în relații, sentimente de inadecvare sau suferință emoțională. Abordarea mea este umanistă, centrată pe acceptare necondiționată.",
  "Terapia este despre redescoperirea propriei voci. Încurajez autenticitatea, introspecția și curajul de a explora ceea ce doare. Mă bazez pe formarea mea în psihoterapie integrativă și pe experiența de lucru cu persoane aflate în căutarea unui sens mai profund.",
  "Am convingerea că oamenii au resurse nebănuite atunci când se simt susținuți. Creez spații de siguranță psihologică, în care emoțiile pot fi procesate și înțelese. Ofer ghidaj în identificarea tiparelor disfuncționale și dezvoltarea unei perspective mai sănătoase.",
  "Misiunea mea este să fiu alături de cei care se simt pierduți, neînțeleși sau copleșiți. Folosesc metode validate și mă adaptez stilului de învățare al fiecărui client. Cred în echilibrul dintre acceptare și schimbare, și în importanța conexiunii umane.",
  "Terapia este un spațiu în care învățăm să fim mai blânzi cu noi înșine. Mă inspir din abordările cognitiv-comportamentale, centrate pe compasiune și atașament. Sunt aici pentru a oferi susținere, direcție și încredere în procesul tău de vindecare."
];

    const description = specialistDescriptions[i % specialistDescriptions.length];


      const specialist = await Specialist.create({
        description: description,
        linkedin: faker.internet.url(),
        facebook: faker.internet.url(),
        website: faker.internet.url(),
        isTherapist: true,
        formation: faker.helpers.arrayElement(FORMATIONS),
        therapyStyle: faker.helpers.arrayElement(STYLES),
        userId: user.id
      });

      specialists.push({ ...specialist.dataValues, user });
    }

    for (let i = 0; i < 80; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = `${removeDiacritics(firstName)}.${removeDiacritics(lastName)}@gmail.com`;

      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber: faker.phone.number('+40 7## ### ###'),
        birthdate: faker.date.past({ years: 18, refDate: '2005-01-01' }),
        gender: faker.helpers.arrayElement(GENDERS),
        password: passwordHash,
        role: 'angajat',
        profileImage: null,
      });

      const employee = await Employee.create({
        hireDate: faker.date.past({ years: 10 }),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        isManager: Math.random() < 0.2,
        allowAnonymous: true,
        preferredGender: faker.helpers.arrayElement(GENDERS),
        preferredMinAge: 28 + Math.floor(Math.random() * 5),
        preferredMaxAge: 45 + Math.floor(Math.random() * 10),
        preferredFormation: faker.helpers.arrayElement(FORMATIONS),
        preferredSpecialization: null,
        preferredTherapyStyle: faker.helpers.arrayElement(STYLES),
        userId: user.id,
      });

      employees.push({ ...employee.dataValues, user });
    }

    const therapistNotesRO = [
  "Clientul a vorbit despre stresul acumulat la locul de muncă.",
  "Am explorat relația cu familia și impactul acesteia asupra stării emoționale.",
  "Ședința s-a concentrat pe identificarea gândurilor negative automate.",
  "Am discutat despre tehnici de respirație pentru anxietate.",
  "Clientul a făcut progrese în exprimarea emoțiilor.",
  "Am analizat evenimente recente care au declanșat stări de tristețe.",
  "Clientul a fost deschis și implicat pe tot parcursul sesiunii.",
  "S-a lucrat pe construirea unei rutine de auto-îngrijire.",
  "Am explorat amintiri din copilărie care influențează comportamentele actuale.",
  "Clientul a identificat un obiectiv clar pentru săptămâna următoare.",
  "Sesiunea a evidențiat nevoia de a seta limite sănătoase în relații.",
  "Am folosit o tehnică de relaxare ghidată pentru reducerea stresului.",
  "Am observat o ușoară reducere a nivelului de anxietate raportat.",
  "Clientul a exprimat sentimente de vinovăție legate de decizii recente.",
  "Am încurajat jurnalizarea ca mijloc de conștientizare emoțională."
];

    let sessionCount = 0;
    for (const specialist of specialists) {
      const numSessions = 10 + Math.floor(Math.random() * 6);

      for (let i = 0; i < numSessions; i++) {
        const employee = faker.helpers.arrayElement(employees);
        const date = randomDateInPastMonths(3);
        const [begin, end] = randomTimeSlot();

        const interval = await Interval.create({
          date,
          beginTime: begin,
          endTime: end,
          status: true,
          specialistId: specialist.id,
        });

        await TherapySession.create({
          satisfactionScore: 1 + Math.floor(Math.random() * 5),
          notes: faker.helpers.arrayElement(therapistNotesRO),
          intervalId: interval.id,
          employeeId: employee.id,
        });

        sessionCount++;
        if (sessionCount >= 300) break;
      }

      if (sessionCount >= 300) break;
    }

    console.log("Baza de date a fost populată cu succes!");
    process.exit(0);
  } catch (err) {
    console.error("Eroare la populare:", err);
    process.exit(1);
  }
})();
