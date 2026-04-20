import { useParams } from "react-router-dom";

export default function ApplicationEditPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>申請編集画面</h2>
      <p>申請ID: {id}</p>
    </div>
  );
}
