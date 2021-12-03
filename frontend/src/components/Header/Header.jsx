import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faHome, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import {userService} from "../../services/user.service";
import {useRouter} from "next/router";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  let showNavigationHome = router.pathname !== "/";
  function logout() {
    userService.logout();
  }

  return (
    <div className="d-flex justify-content-between">
      <div className="logo-container d-flex align-items-center">
        <img className="px-3 img-fluid" src="/logo.png" width="150" alt="joureka Logo"/>
      </div>
      <div className="header-buttons-container p-4 d-flex flex-row justify-content-between">
        {showNavigationHome &&  <Link href="/project/create"><button className="icon-button-transparent icon-blue mx-2">
          <FontAwesomeIcon size="lg" icon={faFolderPlus} />
        </button></Link>}
        {showNavigationHome &&  <Link href="/"><button className="icon-button-transparent icon-orange mx-2">
          <FontAwesomeIcon icon={faHome} />
        </button></Link>}
        <button className="icon-button-transparent icon-orange mx-2">
          <FontAwesomeIcon icon={faUser} />
        </button>
        <button className="icon-button-transparent icon-orange mx-2">
          <FontAwesomeIcon icon={faCog} />
        </button>
        <button onClick={logout} className="icon-button-round mx-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
};

export default Header;


