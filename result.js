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
const decodedAnswers = decodeUserChoices(userAnswers) || [];

// Concatenate decoded answers into answerall string with newline separator
decodedAnswers.forEach(answer => answerall += answer + '\n');

// Log accumulated answers
console.log(answerall);
empfehlungengenrieren(answerall);

async function empfehlungengenrieren(info) {
    const loaderDiv = document.getElementById("loader");
    loaderDiv.style.display = "block";
    const apiKey = 'fresed-KU9B7cizg5ELIB9Cx4E5lqrJ2F3qkc';
    const endpoint = 'https://fresedgpt.space/v1/chat/completions';

    const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'You are an AI that will get information about a user and then you will select a movie for them. Only say the title, no sentence. Your response will be feed into an api so no sentence only the movie example: "Minions" '
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

        if (!response.ok) {
            throw new Error(`API error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        const movie = data.choices[0].message.content.trim();
        console.log(movie);

        try {
            const resultDiv = document.getElementById("result");
            const omdbResponse = await fetch(`https://www.omdbapi.com/?t=${movie}&plot=full&apikey=d2c54f11`);

            if (!omdbResponse.ok) {
                throw new Error(`OMDb API error: ${omdbResponse.status} - ${omdbResponse.statusText}`);
            }

            const omdbData = await omdbResponse.json();
            if (omdbData.Response === "False") {
                throw new Error(`OMDb API error: ${omdbData.Error}`);
            }

            const movieImageUrl = omdbData.Poster || "";
            const img = new Image();
            img.src = movieImageUrl;
            img.alt = omdbData.Title;

            let streamingOptionsString = "Streaming options not available.";

            try {
                const streamingUrl = `https://streaming-availability.p.rapidapi.com/shows/${omdbData.imdbID}?series_granularity=show`;
                const streamingOptions = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
                        'x-rapidapi-key': '653e94f46fmsh8b51545d47a9c6fp145395jsn1c7aa34e031c'
                    }
                };

                const streamingResponse = await fetch(streamingUrl, streamingOptions);

                if (!streamingResponse.ok) {
                    throw new Error(`Streaming API error: ${streamingResponse.status} - ${streamingResponse.statusText}`);
                }

                const streamingData = await streamingResponse.json();
                if (streamingData.message) {
                    throw new Error(`Streaming API error: ${streamingData.message}`);
                }

                const streamingOptionsArray = streamingData.streamingOptions.de || [];
                const seenServiceNames = new Set();
                streamingOptionsString = streamingOptionsArray
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
            } catch (error) {
                console.error('Error fetching Streaming data:', error);
            }
            

            resultDiv.innerHTML += `
            <div class="result-card bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
              <h4 class="text-xl font-semibold mb-4">${omdbData.Title}</h4>
              <img src="${img.src}" alt="${img.alt}" class="w-full h-auto mb-4 rounded-md" />
              <p class="mb-2"><strong>Released:</strong> ${omdbData.Released}</p>
              <p class="mb-2"><strong>Runtime:</strong> ${omdbData.Runtime}</p>
              <p class="mb-2"><strong>Genre:</strong> ${omdbData.Genre}</p>
              <p class="mb-2"><strong>Director:</strong> ${omdbData.Director}</p>
              <p class="mb-2"><strong>Writer:</strong> ${omdbData.Writer}</p>
              <p class="mb-2"><strong>Actors:</strong> ${omdbData.Actors}</p>
              <p class="mb-2"><strong>Rating:</strong> ${omdbData.imdbRating}</p>
              <p class="mb-2"><strong>Streaming Options:</strong> ${streamingOptionsString}</p>
            </div>
          `;

            img.onerror = () => {
                console.error('Image load error');
            };
        } catch (error) {
            console.error('Error fetching OMDb data:', error);
            if (retryCount < 3) {
                console.log('Retrying OMDb API request...');
                return empfehlungGenerieren(info, retryCount + 1);
            } else {
                const resultDiv = document.getElementById("result");
                resultDiv.innerHTML += `
                    <div class="result-card bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
                      <p class="text-red-500">Failed to fetch movie recommendation. Please try again later.</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        if (retryCount < 3) {
            console.log('Retrying ChatGPT API request...');
            return empfehlungGenerieren(info, retryCount + 1);
        } else {
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML += `
                <div class="result-card bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
                  <p class="text-red-500">Failed to fetch movie recommendation. Please try again later.</p>
                </div>
            `;
        }
    }
    loaderDiv.style.display = "none";
}