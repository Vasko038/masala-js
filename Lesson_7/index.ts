const loginContainer = document.getElementById("loginContainer");
const loyautContainer = document.getElementById("loyautContainer");
let departments: any | null;
declare const confetti: {
  start: () => void;
  stop: () => void;
};
const usernameForm = document.getElementById("usernameForm");
const usernameInput = document.getElementById(
  "usernameInput"
) as HTMLInputElement;
declare var Toastify: any;
const mainLoginH1 = document.getElementById("mainLoginH1") as HTMLElement;
const registorOrLoginBtn = document.getElementById(
  "registorOrLogin"
) as HTMLButtonElement;
const userData = document.getElementById("userData") as HTMLElement;
const linkLoginOrSign = document.getElementById(
  "linkLoginOrSign"
) as HTMLElement;
const passwordInput = document.getElementById(
  "passwordInput"
) as HTMLInputElement;
const emailInput = document.getElementById("emailInput") as HTMLInputElement;
let registorOrLogin: string = "login";
const departmentsContainer: HTMLElement | null =
  document.getElementById("departments");
const questionsConatiner: HTMLElement | null =
  document.getElementById("questions");
const doYouHave = document.getElementById("doYouHave");
const answerConatiner: HTMLElement | null = document.getElementById("answer");
const mainP: HTMLElement | null = document.getElementById("mainP");
async function getDepartemnts() {
  //@ts-ignore
  const res = await axios.get("https://8737794e5a9a8250.mokky.dev/Departments");
  if (res.status === 200) {
    console.log(Object.values(res.data[0]));
    return Object.values(res.data[0]);
  } else {
    throw new Error("Failed to fetch departments");
  }
}
async function getUsers() {
  //@ts-ignore
  const res = await axios.get("https://8737794e5a9a8250.mokky.dev/users");
  if (res.status == 200) {
    console.log(res.data);
    return res.data;
  }
}
interface ss {
  answers: any;
  check: any;
  examples: object;
  fun_name: string;
  solved: boolean;
  text: string;
}
interface s {
  id: string;
  title: string;
  questionsNumber: number;
  questions: ss[];
}
interface User {
  id: number;
  email: string;
  password: string;
  tasks: object;
  username: string;
  avatarImage: string;
}
function success(text: string): void {
  Toastify({
    text,
    duration: 1000,
    style: { background: "rgb(5, 150, 5)", borderRadius: "10px" },
  }).showToast();
}
function error(text: string): void {
  Toastify({
    text,
    duration: 1000,
    style: { background: "rgb(255, 0, 0)", borderRadius: "10px" },
  }).showToast();
}
async function renderDepartments() {
  departments = await getDepartemnts();
  if (departmentsContainer && departments) {
    departmentsContainer.innerHTML = "";
    departments.forEach((department: s) => {
      const div = document.createElement("div");
      div.className = "col-12 col-md-6 col-lg-4 ss";
      div.innerHTML = `
       <div class="card" onclick="listQuestion('${department.id}')">
        <h4>${department.title}</h4>
        <div class="d-flex justify-content-between align-items-end">
        <p class="m-0 mb-3">${department.questionsNumber} <i  class="icon fa-regular fa-clipboard"></i></p>
         <div class="circle">0%</div>
        </div>
       </div>
      `;
      departmentsContainer.appendChild(div);
    });
  }
}
async function renderQuestions(id: string) {
  const departments: any = await getDepartemnts();
  let department: s | undefined = departments.find(
    (department: s) => department.id === id
  );
  if (department && questionsConatiner && departmentsContainer) {
    questionsConatiner.innerHTML = "";
    questionsConatiner.innerHTML = `
  <div class="d-flex my-3"> 
   <h1>${department.title}</h1>
  <button  onclick="home()" class="btn returnHomeBtn"><i class="fa-solid fa-arrow-left"></i></button>
  </div>
  `;
    Object.values(department.questions).forEach(
      (question: ss, index: number) => {
        const div = document.createElement("div");
        div.className = "col-12 col-sm-6 col-md-4 col-lg-3 ss";
        div.innerHTML = `
     <div class="card h-100 d-flex flex-row align-items-center justify-content-between " onclick="answer('${id}',${index})">
      <h4>${question.fun_name.split(" ")[0]}</h4>
          <span id="cardChekIcon-${index}" class="d-none"><i class="fa-solid fa-check"></i></span>
     </div>
    `;
        questionsConatiner.appendChild(div);
      }
    );
  }
}
async function answer(id: string, questionId: number) {
  let department: s | undefined = departments.find(
    (department: s) => department.id === id
  );
  if (
    department &&
    questionsConatiner &&
    departmentsContainer &&
    answerConatiner &&
    mainP
  ) {
    let questions: ss[] | null = Object.values(department.questions);
    if (questions) {
      const firstAnswerColumn = document.getElementById("firstAnswerColumn");
      if (firstAnswerColumn) {
        firstAnswerColumn.innerHTML = "";
        firstAnswerColumn.innerHTML = `
      <button onclick="home()" class="btn returnHomeBtn m-0 "><i class="fa-solid fa-house"></i></button>
      <button onclick="listQuestion('${id}')" class="btn returnHomeBtn m-0 ms-2"><i class="fa-solid fa-arrow-left"></i></button>
      <button onclick="nextOrBefore('${id}','${questionId}','minus')" class="btn btnNext m-0 ms-2">Oldingisi</button>
      <button onclick="nextOrBefore('${id}','${questionId}','plus')"  class="btn btnNext m-0 ms-2">Keyingisi</button>`;
        firstAnswerColumn.innerHTML += `
     <h3 class="my-3">${
       Object.values(department.questions)[questionId].fun_name.split(" ")[0]
     }</h3>
     <p>${Object.values(department.questions)[questionId].text}</p>
    `;
        const examples: any | null = Object.values(department.questions)[
          questionId
        ].examples;
        if (examples) {
          const exmaplesUl = document.createElement("ul");
          exmaplesUl.innerHTML = "";
          examples.forEach((example: string) => {
            exmaplesUl.innerHTML += `
        <li>${example}</li>
        `;
          });
          firstAnswerColumn.appendChild(exmaplesUl);
          firstAnswerColumn.innerHTML += `
          <h4>Natijalar <span id="checkIcon-${questionId}" class="d-none"><i class="fa-solid fa-check"></i></span></h4>
          <div id="result"></div>
          `;
        }
      }
      const codeAnswer = document.getElementById(
        "codeAnswer"
      ) as HTMLTextAreaElement;
      if (codeAnswer) {
        codeAnswer.value = "";
        codeAnswer.value = `function ${
          Object.values(department.questions)[questionId].fun_name
        } { 
  
 }`;
      }

      const isComplete = document.getElementById("tekshirish");
      if (isComplete) {
        isComplete.addEventListener("click", () => {
          isChecked(id, questionId);
        });
      }
    }
    mainP.classList.add("d-none");
    departmentsContainer.classList.add("d-none");
    answerConatiner.classList.remove("d-none");
    questionsConatiner.classList.add("d-none");
  }
}
async function isChecked(id: string, questionId: number) {
  const resultContainer = document.getElementById("result");
  const codeAnswer = document.getElementById(
    "codeAnswer"
  ) as HTMLTextAreaElement;

  let department: s | undefined = departments.find(
    (department: s) => department.id === id
  );

  if (department) {
    let questions: ss[] | null = Object.values(department.questions);
    const examples: any | null = Object.values(department.questions)[questionId]
      .examples;
    const sJP0nZQrW9Yo4: string = codeAnswer.value;
    const javoblar = [] as any[];
    try {
      Object.values(department.questions)[questionId].check.forEach(
        (a: string, index: number) => {
          let res: any;
          eval(`
        ${sJP0nZQrW9Yo4}
        res=${
          Object.values(department.questions)[questionId].fun_name.split(" ")[0]
        }(${Object.values(department.questions)[questionId].check[index]})
      `);
          if (res || Number(res) == 0) {
            javoblar.push(res);
          } else if (res == "undefined") {
            resultContainer.innerHTML = `
            <h4 class="mt-3 text-danger">Undifened</h4>
            `;
          } else {
            console.log(res);
          }
        }
      );
      if (questions && resultContainer && codeAnswer) {
        let count: number = 0;
        resultContainer.innerHTML = "";
        const question = Object.values(department.questions)[questionId];
        examples.forEach((example: string, index: number) => {
          if (question.answers[index] == javoblar[index]) {
            count++;
          }
          const answerClass =
            question.answers[index] == javoblar[index] ? "success" : "danger";
          resultContainer.innerHTML += `
          <div class="d-flex justify-content-between my-2">
            <p>${example}</p>
            <button class="btn btn-${answerClass}">Javobingiz: ${javoblar[index]}</button>
          </div>
        `;
        });
        if (count === question.answers.length) {
          confetti.start();
          setTimeout(function () {
            confetti.stop();
          }, 2000);
          let newDepartments = departments;
          console.log(newDepartments);
          console.log(newDepartments.id.question, "solved");
          newDepartments.id.questions[questionId].solved = true;
          console.log(questions, "qq");
          console.log(newDepartments, "yangi department");
          //@ts-ignore
          const res = await axios.patch(
            `https://8737794e5a9a8250.mokky.dev/Departments`,
            newDepartments
          );
          if (res.status == 200) {
            console.log("y");
          } else {
            console.log("n");
          }
        } else {
          console.log(" kod hali ham barcha shartlarni qanoatlantirmyadi");
          console.log(count, question.answers.length);
        }
      }
    } catch (e) {
      if (e instanceof ReferenceError) {
        resultContainer.innerHTML = resultContainer.innerHTML = `
        <h4 class="text-danger mt-3">${e.message}</h4>
        `;
        console.log(e.message);
      }
      console.log(e.message);
    }

    console.log(javoblar);
  }
}
async function nextOrBefore(id: string, questionId: string, action: string) {
  let department: s | undefined = departments.find(
    (department: s) => department.id === id
  );

  if (department) {
    let questions: ss[] | null = Object.values(department.questions);
    if (questions) {
      if (action == "plus" && questions.length > Number(questionId) + 1) {
        answer(id, Number(questionId) + 1);
      } else if (action == "minus" && 0 < Number(questionId)) {
        answer(id, Number(questionId) - 1);
      } else {
        console.log("chegaraga yetdi");
      }
    } else {
      console.log("questions mavjud emas");
    }
  } else {
    console.log("department mavjud emas");
  }
}
async function listQuestion(id: string) {
  if (questionsConatiner && departmentsContainer && answerConatiner && mainP) {
    departmentsContainer.classList.add("d-none");
    answerConatiner.classList.add("d-none");
    questionsConatiner.classList.remove("d-none");
    mainP.classList.remove("d-none");
    questionsConatiner.innerHTML = `<div class="d-flex justify-content-center">
  <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>`;
    renderQuestions(id);
  } else {
    console.log("xatolik");
  }
}
async function home() {
  if (questionsConatiner && departmentsContainer && answerConatiner && mainP) {
    mainP.classList.remove("d-none");
    answerConatiner.classList.add("d-none");
    departmentsContainer.classList.remove("d-none");
    questionsConatiner.classList.add("d-none");
  }
}
function ChangeLoginSign(event: Event) {
  event.preventDefault();
  if (
    registorOrLoginBtn &&
    mainLoginH1 &&
    registorOrLogin &&
    linkLoginOrSign &&
    doYouHave &&
    usernameInput
  ) {
    if (registorOrLogin == "login") {
      usernameForm.classList.remove("d-none");
      registorOrLoginBtn.innerText = "Sign";
      mainLoginH1.innerText = "Sign";
      linkLoginOrSign.innerText = "Open account";
      doYouHave.innerText = "do you have a acount?";
      passwordInput.value = "";
      emailInput.value = "";
      usernameInput.value = "";
      registorOrLogin = "sign";
    } else if (registorOrLogin == "sign") {
      usernameForm.classList.add("d-none");
      registorOrLoginBtn.innerText = "Login";
      mainLoginH1.innerText = "Login";
      linkLoginOrSign.innerText = "Create Account";
      doYouHave.innerText = "do you havn't a account? ";
      passwordInput.value = "";
      emailInput.value = "";
      usernameInput.value = "";
      registorOrLogin = "login";
    }
  }
}
async function enter(e: Event) {
  e.preventDefault();
  if (registorOrLogin == "login") {
    const users = await getUsers();
    console.log(users);
    const user: User | undefined = users.find(
      (user: User) => user.email == emailInput.value
    );
    if (user) {
      loginContainer.classList.add("d-none");
      loyautContainer.classList.remove("d-none");
      userData.innerHTML = `
      <p clas="mt-0">username: ${user.username}</p>
      <p class="mt-0"> email: ${user.email}</p>
      `;
      success("muvafaqityatli kirib oldingiz");
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.log("user Mavjud emas", console.log(user));
    }
  } else if (registorOrLogin == "sign") {
    const newUser = {
      password: passwordInput.value,
      email: emailInput.value,
      username: usernameInput.value,
      tasks: {},
    } as User;
    userData.innerHTML = `
    <p class="mt-0"> username: ${newUser.username}</p>
    <p class="mt-0"> email: ${newUser.email}</p>
    `;

    //@ts-ignore
    const res = await axios.post(
      "https://8737794e5a9a8250.mokky.dev/users",
      newUser
    );
    if (res.status == 201) {
      success("Muvafaqiyaatli qoshildi");
      loginContainer.classList.add("d-none");
      loyautContainer.classList.remove("d-none");
      localStorage.setItem("user", JSON.stringify(newUser));
    }
  }
}
function logout(event: Event) {
  event.preventDefault();
  try {
    localStorage.removeItem("user");
    loginContainer.classList.remove("d-none");
    loyautContainer.classList.add("d-none");
  } catch (e) {
    error(e);
  }
}
window.addEventListener("load", () => {
  const user: User = JSON.parse(localStorage.getItem("user"));
  if (user) {
    userData.innerHTML = `
    <p class="m-0"> username: ${user.username}</p>
    <p class="m-0"> email: ${user.email}</p>
    `;
    loginContainer.classList.add("d-none");
    loyautContainer.classList.remove("d-none");
  } else {
    loginContainer.classList.remove("d-none");
    loyautContainer.classList.add("d-none");
  }
});
renderDepartments();
