# Film Finder

Film Finder is a web application designed to recommend movies based on user preferences. It utilizes the OMDb API to fetch movie details and a custom AI model to generate recommendations.

## Features

- **User Preferences Input**: Users can input their favorite movies to receive personalized recommendations.
- **AI-Powered Recommendations**: Utilizes an AI model to analyze user preferences and suggest movies.
- **Detailed Movie Information**: Displays detailed information about the recommended movies, including director, writer, actors, and IMDb rating.
- **Streaming Options**: Provides information on where the recommended movies can be streamed.

## How It Works

1. **User Input**: The user inputs their favorite movies in the form provided on the `films.html` page.
2. **Recommendation Generation**: The application sends the user's preferences to an AI model via an API, which then returns a movie recommendation.
3. **Movie Details Fetching**: The application fetches detailed information about the recommended movie from the OMDb API.
4. **Display Results**: The detailed information about the recommended movie is displayed to the user.

## Setup

To run Film Finder locally, follow these steps:

1. Clone the repository to your local machine.
2. Open `films.html` in your browser to start the application.

## Technologies Used

- HTML/CSS for the frontend.
- JavaScript for the backend logic.
- OMDb API for fetching movie details.
- ChatGPT(Free Chatanywhere API) 3.5 is used for generating movie recommendations.

## Files Structure

- `films.html`: Entry point for users to input their favorite movies.
- `result.html`: Displays the AI-generated movie recommendation and its details.
- `resultfilmes.html`: Alternative result page.
- `quiz.html`: (If applicable) A quiz page for further engaging the user.
- `styles.css`: Contains the CSS styles for the application.
- `script.js`, `quiz.js`, `result.js`, `resultfilms.js`: JavaScript files containing the logic for fetching data, generating recommendations, and displaying results.

## Contributing

Contributions to Film Finder are welcome! Please refer to the contributing guidelines for more information.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
