import { Link } from "react-router-dom";
import Trust from './trustpilot-2.svg';
import Google from './icons8-google.svg';
import Spinner from 'react-spinner-material';

export default function Rate({ infoRes }) {
  if (!infoRes) {
    return (
      <div className='justify-center items-center flex h-screen'>
        <Spinner size={100} spinnerColor={"#28509E"} spinnerWidth={1} visible={true} style={{ borderColor: "#28509E", borderWidth: 2 }} />
      </div>
    );
  }

  const { google_buss, trustpilot_link } = infoRes;
  console.log('gg ', google_buss , 'pilot', trustpilot_link);
  const hasGoogle = google_buss !== null && google_buss !== "";
  const hasTrustpilot = trustpilot_link !== null && trustpilot_link !== "";

  return (
    <main className="flex flex-col items-center justify-center h-screen px-4 ">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold text-[#333] dark:text-[#f8f8f8]">Leave us a review!</h1>
        {
          (hasGoogle || hasTrustpilot) &&  
            <p className="text-[#666] dark:text-[#ccc]">Tap a button below to share your experience.</p>
        }
        <div className="grid grid-cols-1 gap-4 w-full">
          {hasGoogle && (
            <Link
              className="bg-gray-200 hover:bg-blue-400 hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              to={google_buss}
            >
              <img src={Google} alt="Google Reviews" className="w-8 h-8 mr-2" />
              Google Reviews
            </Link>
          )}
          {hasTrustpilot && hasGoogle && (
            <p className="text-[#666] dark:text-[#ccc]">Or</p>
          )}
          {hasTrustpilot && (
            <Link
              className="bg-gray-200 hover:bg-[#009967] hover:text-white text-black font-bold py-6 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              to={trustpilot_link}
            >
              <img src={Trust} alt="TrustPilot" className="w-8 h-8 mr-2" />
              Trustpilot Reviews
            </Link>
          )}
          {!hasGoogle && !hasTrustpilot && (
            <p className="text-[#666] dark:text-[#ccc]">We're working on adding review functionality soon. Stay tuned!</p>
          )}
        </div>
      </div>
    </main>
  );
}
