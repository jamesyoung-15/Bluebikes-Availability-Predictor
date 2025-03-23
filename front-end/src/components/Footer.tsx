import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
} from "@fortawesome/free-brands-svg-icons";


const Footer = () => {
  return (
    <footer className="w-[100%]  border-t-1 border-gray-700 text-sm">
      <div className="flex flex-col justify-center align center my-3">
        <p className="mx-auto">Created by James Young</p>
        <a
          className="mx-auto my-3 hover:text-purple-300"
          href="https://github.com/jamesyoung-15/Bluebikes-Availability-Predictor/"
          target="_blank"
        >
          Source Code
          <FontAwesomeIcon icon={faGithub} className="ml-2" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;