import { styled } from "@mui/material";

const Card = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  padding: "20px",
  borderRadius: "8px",
  transition: "background-color 0.3s, color 0.3s",
}));

const SimpleCard = ({}) => {
  return (
    <Card>
      <p>Hello</p>
    </Card>
  );
};

export default SimpleCard;
