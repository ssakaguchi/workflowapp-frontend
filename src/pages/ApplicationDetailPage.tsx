import { useParams } from "react-router-dom";

export default function ApplicationDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <h2>申請詳細画面</h2>
      <p>申請ID: {id}</p>
    </div>
  );
}
