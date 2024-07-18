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

let answerall = ''; // Initialize as an empty string to accumulate answers

const decodeUserChoices = (answers) => {
    const decodedAnswers = [];

    for (let i = 0; i < answers.length; i++) {
        const optionIndex = parseInt(answers.charAt(i)) - 1;
        const answerSentence = `Frage: ${questions[i].title.toLowerCase()} Antwort: ${questions[i].options[optionIndex].toLowerCase()}.`;
        decodedAnswers.push(answerSentence);
    }

    return decodedAnswers;
};

const urlParams = new URLSearchParams(window.location.search);
const userAnswers = urlParams.get('result');
const decodedAnswers = decodeUserChoices(userAnswers);

// Concatenate decoded answers into answerall string with newline separator
decodedAnswers.forEach(answer => answerall += answer + '\n');

// Log accumulated answers
console.log(answerall);
empfehlungengenrieren(answerall)
async function empfehlungengenrieren(info) {
    const loaderDiv = document.getElementById("loader");
    loaderDiv.style.display = "block";
    const apiKey = 'sk-pxNju75vKyXJVhjySvLCTdKxluNcijXvQDgFmpRRjZIWgAqe';
    const endpoint = 'https://api.chatanywhere.tech/v1/chat/completions';

    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an AI that will get information about a user and then you will select a movie for them. Only say the title, no sentence. Your response will be feed into an api so no sentence only the movie example : "Minions"'
            },
            {
                role: 'user',
                content: "Only say the title, no sentence. Your response will be feed into an api so no sentence only the movie" + info
            }
        ],
        max_tokens: 50,
        temperature: 0.7
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        const movie = data.choices[0].message.content.trim();
        console.log(movie);

        try {
            const resultDiv = document.getElementById("result");
            const omdbResponse = await fetch(`https://www.omdbapi.com/?t=${movie}&plot=full&apikey=d2c54f11`);
            const omdbData = await omdbResponse.json();
    
            if (!omdbResponse.ok) {
                throw new Error(`OMDb API error: ${omdbData.Error}`);
            }
    
            const movieImageUrl = omdbData.Poster || "";
            const img = new Image();
            img.src = movieImageUrl;
            img.alt = omdbData.Title;
    
            const streamingUrl = `https://streaming-availability.p.rapidapi.com/shows/${omdbData.imdbID}?series_granularity=show`;
            const streamingOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                    'x-rapidapi-key': 'b14989e7e3mshee573bc0909e98dp1c06cdjsn54766e9f0646'
                }
            };
    
            const streamingResponse = await fetch(streamingUrl, streamingOptions);
            const streamingData = await streamingResponse.json();
    
            if (!streamingResponse.ok) {
                throw new Error(`Streaming API error: ${streamingData.message}`);
            }
            console.log(streamingData.streamingOptions.de);
            const streamingOptionsArray = streamingData.streamingOptions.de || [];
            const seenServiceNames = new Set();
            const streamingOptionsString = streamingOptionsArray
                .filter(option => {
                    const serviceName = option.service.name;
                    if (!seenServiceNames.has(serviceName)) {
                        seenServiceNames.add(serviceName);
                        return true;
                    }
                    return false;
                })
                .map(option => {
                    const service = option.service;
                    return `<a href="${option.link}" target="_blank">${service.name}</a>`;
                })
                .join(", ");
    
            console.log(streamingOptionsString);
            resultDiv.innerHTML += `
                <div class="result">
                    <h4>${omdbData.Title}</h4>
                    <img src="${img.src}" alt="${img.alt}" />
                    <p><strong>Released:</strong> ${omdbData.Released}</p>
                    <p><strong>Runtime:</strong> ${omdbData.Runtime}</p>
                    <p><strong>Genre:</strong> ${omdbData.Genre}</p>
                    <p><strong>Director:</strong> ${omdbData.Director}</p>
                    <p><strong>Writer:</strong> ${omdbData.Writer}</p>
                    <p><strong>Actors:</strong> ${omdbData.Actors}</p>
                    <p><strong>Rating:</strong> ${omdbData.imdbRating}</p>
                    <p><strong>Streaming Options:</strong> ${streamingOptionsString}</p>
                </div>
            `;

        img.onerror = () => {
            console.error('Image load error');
        };
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
    loaderDiv.style.display = "none";
}