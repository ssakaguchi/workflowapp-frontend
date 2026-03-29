import { logout } from "../../utils/logout";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 左側 */}
        <Typography variant="h6" component="div">
          Workflow App
        </Typography>

        {/* 右側 */}
        {authenticated && (
          <Button color="inherit" onClick={handleLogout}>
            ログアウト
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
