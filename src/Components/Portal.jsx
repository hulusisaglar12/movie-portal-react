import { createPortal } from "react-dom";

function Portal({ children }) {
  const portalRoot = document.getElementById("portal-root");
  return createPortal(children, portalRoot);
}

export default Portal;