import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import { getMyFiles, downloadFile } from "../../api/file";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    getMyFiles()
      .then((data) => {
        if (!ignore) setFiles(data.data || []);
      })
      .catch((error) => {
        if (!ignore) console.error("파일 목록 조회 실패", error);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleDownload = async (file) => {
    try {
      setDownloadingId(file.id);
      await downloadFile(file.id, file.fileName);
    } catch (error) {
      console.error("파일 다운로드 실패", error);
      alert("파일 다운로드에 실패했습니다.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">파일함</h1>
          <p className="mt-1 text-[15px] text-ink-tertiary">
            Agent가 만든 파일을 모아서 볼 수 있어요
          </p>
        </div>

        {loading && (
          <Card className="py-16 text-center text-ink-tertiary">
            불러오는 중...
          </Card>
        )}

        {!loading && files.length === 0 && (
          <Card className="py-16 text-center text-ink-tertiary">
            아직 생성된 파일이 없습니다.
          </Card>
        )}

        {!loading && files.length > 0 && (
          <Card className="p-0">
            <div className="divide-y divide-line">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">
                      {file.fileName}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-tertiary">
                      {formatBytes(file.sizeBytes)} ·{" "}
                      {formatDate(file.createdAt)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(file)}
                    disabled={downloadingId === file.id}
                    className="shrink-0 rounded-2xl bg-surface-alt px-4 py-2 text-sm font-semibold text-ink-sub hover:bg-line disabled:opacity-50"
                  >
                    {downloadingId === file.id ? "다운로드 중..." : "다운로드"}
                  </button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}

export default FileList;
