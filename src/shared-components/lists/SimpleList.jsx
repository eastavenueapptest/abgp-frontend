import { CalendarToday } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { formatStatus } from "../../utils/formatStatus";

const SimpleList = ({ items, label, status, date, longText }) => {
  if (items?.length < 0) {
    return (
      <ul>
        <li>No Records Found.</li>
      </ul>
    );
  }

  return (
    <ul className="list-group">
      {items?.map((item, index) => (
        <li key={index} className="border list-group-item mb-1 py-3">
          <div>
            <p>{item[label]}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            {formatStatus(item[status])}
            <Chip
              label={item[date]}
              color="default"
              size="small"
              variant="contained"
              sx={{ p: 1 }}
              icon={<CalendarToday />}
            />
          </div>
          <div>
            <hr />
            {item[longText]}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SimpleList;
