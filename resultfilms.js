const urlParams = new URLSearchParams(window.location.search);
const userAnswers = urlParams.get('films');
empfehlungengenrieren(userAnswers)
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