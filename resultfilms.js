const urlParams = new URLSearchParams(window.location.search);
const userAnswers = urlParams.get('films');
empfehlungengenrieren(userAnswers)
async function empfehlungengenrieren(info) {
    const loaderDiv = document.getElementById("loader");
    loaderDiv.style.display = "block";
    const apiKey = '07a6c53364f74730881358baa5bed8a1';
    const endpoint = 'https://api.aimlapi.com/chat/completions';


    const requestData = {
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        messages: [
            {
                role: 'system',
                content: 'You are an AI that will get information about a user and then you will select a movie for them. Only say the title, no sentence. Your response will be feed into an api so no sentence only the movie example : "Minions"'
            },
            {
                role: 'user',
                content: "Only say the title, no sentence. Your response will be feed into an api so no sentence only the movie THe user like sthe following Movies select on efor him : " + info
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
                        'x-rapidapi-key': '553e94f46fmsh8b51545d47a9c6fp145395jsn1c7aa34e031c'
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
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML += `
                <div class="result-card bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
                  <p class="text-red-500">Failed to fetch movie recommendation. Please try again later.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching recommendation:', error);
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML += `
            <div class="result-card bg-secondary text-text p-6 rounded-lg shadow-lg mb-6">
              <p class="text-red-500">Failed to fetch movie recommendation. Please try again later.</p>
            </div>
        `;
    }
    loaderDiv.style.display = "none";
}