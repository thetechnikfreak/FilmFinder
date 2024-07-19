let question;
let form;
let res;
let qno;
let result;
const questions = [
        {
            title: 'Welche Art von Filmen bevorzugst du?',
            options: [
                'Action',
                'Komödie',
                'Drama',
                'Science-Fiction'
            ],
        },
        {
            title: 'Wie möchtest du die Handlung eines Films beschreiben?',
            options: [
                'Komplex und tiefgründig',
                'Leicht und unterhaltsam',
                'Herzzerreißend und emotional',
                'Faszinierend und futuristisch'
            ],
        },
        {
            title: 'Welchen Schauplatz magst du am meisten?',
            options: [
                'Städtisch',
                'Ländlich',
                'Historisch',
                'Außerweltlich'
            ],
        },
        {
            title: 'Welchen Hauptcharakter bevorzugst du?',
            options: [
                'Mutig und entschlossen',
                'Witzig und charmant',
                'Zerbrechlich und verletzlich',
                'Intelligent und visionär'
            ],
        },
        {
            title: 'Wie sollte das Ende eines Films sein?',
            options: [
                'Überraschend und unerwartet',
                'Glücklich und zufriedenstellend',
                'Traurig und tragisch',
                'Offen für Interpretationen'
            ],
        },
        {
            title: 'Welche visuellen Effekte magst du am meisten?',
            options: [
                'Spektakuläre Action-Szenen',
                'Humorvolle visuelle Gags',
                'Tiefe emotionale Momente',
                'Faszinierende Weltgestaltung'
            ],
        },
        {
            title: 'Wie wichtig ist dir die Originalität der Handlung?',
            options: [
                'Sehr wichtig, ich mag einzigartige Geschichten',
                'Ich mag bewährte und bekannte Geschichten',
                'Ich bevorzuge klassische Erzählstrukturen',
                'Ich mag innovative und kreative Ansätze'
            ],
        },
        {
            title: 'Welches Tempo bevorzugst du in einem Film?',
            options: [
                'Schnell und actiongeladen',
                'Ruhig und entspannend',
                'Langsam und bedächtig',
                'Dynamisch und abwechslungsreich'
            ],
        },
        {
            title: 'Welche Art von Filmmusik magst du am meisten?',
            options: [
                'Eindrucksvoller Orchestersoundtrack',
                'Lustige und eingängige Songs',
                'Eindringliche und emotionale Melodien',
                'Experimentelle und futuristische Klänge'
            ],
        },
        {
            title: 'Wie wichtig sind dir Nebencharaktere in einem Film?',
            options: [
                'Sie sollten eine bedeutende Rolle spielen',
                'Sie sollten den Hauptcharakteren unterstützen',
                'Sie sollten emotionale Tiefe verleihen',
                'Sie sollten die Welt des Films bereichern'
            ],
        }
    ];
    


function resetradio() {
    const res = document.querySelector('#res');
    document.querySelectorAll('[type="radio"]').forEach((radio) => {
        radio.removeAttribute("disabled");
    });
    res.setAttribute("class","idle");
    res.innerHTML = "Empty";
}


function getNextQuestion() {
    if(qno == 9) {
        const selectedOption = parseInt(form.op.value);
        result = result * 10 + (selectedOption + 1);
        
        document.location.href = 'result.html?result=' + result;
    }
    else {
        const selectedOption = parseInt(form.op.value);
        result = result * 10 + (selectedOption + 1);
        qno++;
        ques = questions[qno];
        question.innerHTML = ques.title;
        console.log(result);
        const labels = document.querySelectorAll('label');
        labels.forEach((label, idx) => {
            label.innerHTML = ques.options[idx];
        }); 
    }

}

function handleSubmit(e) {
    e.preventDefault();
    if(!form.op.value) {
        alert('Please select an option');
    }
    else if(form.submit.classList.contains('submit')) {
        getNextQuestion();
        form.submit.classList.remove('submit');
        form.submit.value = "Submit"
        form.submit.classList.add('submit');
    }
    
    else if(form.submit.classList.contains('next')) {
        console.log("test");
        document.location.href = 'index.html'
        form.submit.classList.remove('next');
        form.submit.value = "Submit"
        form.submit.classList.add('submit');
        form.reset();
    }
}
function init() {
    document.body.innerHTML = `
    <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-text">
      <div class="bg-secondary text-text p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 id='question' class="text-2xl font-bold mb-6">Question</h2>
        <form>
          <div class="mb-4 flex items-center">
            <input type="radio" id="op1" name="op" value="0" class="mr-2 accent-primary">
            <label for="op1" class="text-lg">Option 1</label>
          </div>
          <div class="mb-4 flex items-center">
            <input type="radio" id="op2" name="op" value="1" class="mr-2 accent-primary">
            <label for="op2" class="text-lg">Option 2</label>
          </div>
          <div class="mb-4 flex items-center">
            <input type="radio" id="op3" name="op" value="2" class="mr-2 accent-primary">
            <label for="op3" class="text-lg">Option 3</label>
          </div>
          <div class="mb-4 flex items-center">
            <input type="radio" id="op4" name="op" value="3" class="mr-2 accent-primary">
            <label for="op4" class="text-lg">Option 4</label>
          </div>
          <input type="submit" name="submit" value='Submit' class="bg-primary text-text py-2 px-4 rounded-full cursor-pointer hover:bg-accent focus:outline-none">
        </form>
      </div>
    </div>
  `;
   question = document.querySelector('#question');
   form = document.querySelector('form');
   res = document.querySelector('#res');
   qno = 0;
   result = 0;
   form.addEventListener('submit', handleSubmit);
   ques = questions[qno];
   question.innerHTML = ques.title;
   const labels = document.querySelectorAll('label');
   labels.forEach((label, idx) => {
    label.innerHTML = ques.options[idx];
   }); 
}
init();

