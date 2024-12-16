import { useState, useEffect } from 'react';
import axios from 'axios';

function useDebounce(value: string, timer: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, timer);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, timer]);
  return debouncedValue;
}

function App() {
  const [city, setCity] : any= useState('');
  const [weather, setWeather] : any= useState(null);
  const [bgImgUrl, setBgImgUrl] : any= useState(
    'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg'
  );
  const debouncedValue = useDebounce(city, 500); // Debounce input for 500ms
  const api_key: string = (import.meta.env.VITE_API_KEY as string);
  console.log(api_key);
  useEffect(() => {
    async function fetchWeather() {
      if (!debouncedValue) {
        setWeather(null);
        return;
      }

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${debouncedValue}&units=metric&appid=${api_key}`
        );
        setWeather(response);
        const condition = response.data.weather[0].main;
        const backgrounds = {
          Clouds: 'https://www.clearias.com/up/Clouds.jpg',
          Rain: 'https://www.skymetweather.com/content/wp-content/uploads/2022/06/Rain-in-Northeast-India-FB-3.jpg',
          Thunderstorm: 'https://miro.medium.com/v2/resize:fit:640/format:webp/0*xXXO-QwJzR0la75A.jpg',
          Drizzle: 'https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/weather/rain/raindrops-misted-on-a-windscreen.jpg',
          Snow: 'https://cdn.britannica.com/79/149179-050-DC23D823/snowflake-threads-wool-coat.jpg',
          Clear: 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg',
          Haze: 'https://cff2.earth.com/uploads/2018/11/13015448/what-is-haze.jpg',
          Smoke: 'https://1.bp.blogspot.com/-T4Wu8ctCPo0/X1uyv0PRN8I/AAAAAAAA9xQ/fq7_QYyw6KsO4Yndbb1FIn7uAKVfQaO0wCLcBGAsYHQ/s1600/Screen%2BShot%2B2020-09-11%2Bat%2B9.16.03%2BAM.png',
          Mist: 'https://img.freepik.com/premium-photo/high-fog-mountains-limited-visibility-bad-weather-conditions-driver_105751-14393.jpg',
          Fog: 'https://zameenblog.s3.amazonaws.com/blog/wp-content/uploads/2019/12/cover-image-3-2.jpg',
        };
        //@ts-ignore
        setBgImgUrl(backgrounds[condition] || backgrounds.Clear);
      } catch (error) {
        setWeather(null);
        console.error(error);
      }
    }
    fetchWeather();
  }, [debouncedValue]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black bg-opacity-50 p-6 rounded-lg w-11/12 max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Weather App</h1>
        <div className="mb-4">
          <input
            type="search"
            placeholder="Enter Your City"
            className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        {!weather ? (
          <h2 className="text-center text-lg font-semibold">
            No Data Found. Please Enter a Valid City.
          </h2>
        ) : (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-semibold">{debouncedValue}</h2>
              <h1 className="text-6xl font-bold">
                {weather.data.main.feels_like}&deg;C
              </h1>
              <div className="flex justify-center items-center mt-2">
                <img
                  className="w-16 h-16"
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                />
                <h3 className="text-xl font-medium capitalize">
                  {weather.data.weather[0].description}
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xl font-bold">{weather.data.main.temp_max}&deg;C</p>
                <p>Maximum Temp</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xl font-bold">{weather.data.main.temp_min}&deg;C</p>
                <p>Minimum Temp</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xl font-bold">{weather.data.main.humidity}%</p>
                <p>Humidity</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xl font-bold">{weather.data.wind.speed} m/s</p>
                <p>Wind Speed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
