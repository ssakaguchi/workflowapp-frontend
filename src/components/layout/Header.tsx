import { getToken } from "../../utils/auth";
import { logout } from "../../utils/logout";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const token = getToken();

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
        {token && (
          <Button color="inherit" onClick={handleLogout}>
            ログアウト
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
