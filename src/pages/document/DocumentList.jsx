import { useEffect, useRef, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { getDocuments, uploadDocument, deleteDocument } from "../../api/document";

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

function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const fileInputRef = useRef(null);

    const fetchDocuments = () => {
        setLoading(true);

        getDocuments()
            .then((data) => setDocuments(data.data || []))
            .catch((error) => console.error("문서 목록 조회 실패", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // 같은 파일을 연달아 선택해도 onChange가 다시 발생하도록 초기화

        if (!file) return;

        if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
            alert("현재는 .txt, .md 문서만 업로드할 수 있어요.");
            return;
        }

        try {
            setUploading(true);
            await uploadDocument(file);
            fetchDocuments();
        } catch (error) {
            console.error("문서 업로드 실패", error);
            alert("문서 업로드에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (documentId) => {
        if (!confirm("이 문서를 삭제할까요? 대화에서 더 이상 참고하지 않아요.")) {
            return;
        }

        try {
            setDeletingId(documentId);
            await deleteDocument(documentId);
            setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
        } catch (error) {
            console.error("문서 삭제 실패", error);
            alert("문서 삭제에 실패했습니다.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <MainLayout>
            <div className="mx-auto max-w-4xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-ink">문서함</h1>
                        <p className="mt-1 text-[15px] text-ink-tertiary">
                            업로드한 문서를 대화할 때 자동으로 참고해요 (.txt, .md)
                        </p>
                    </div>

                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt,.md"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                            {uploading ? "업로드 중..." : "+ 문서 업로드"}
                        </Button>
                    </div>
                </div>

                {loading && (
                    <Card className="py-16 text-center text-ink-tertiary">불러오는 중...</Card>
                )}

                {!loading && documents.length === 0 && (
                    <Card className="py-16 text-center text-ink-tertiary">
                        아직 업로드한 문서가 없습니다.
                    </Card>
                )}

                {!loading && documents.length > 0 && (
                    <Card className="p-0">
                        <div className="divide-y divide-line">
                            {documents.map((document) => (
                                <div
                                    key={document.id}
                                    className="flex items-center justify-between px-6 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-ink">{document.fileName}</p>
                                        <p className="mt-0.5 text-sm text-ink-tertiary">
                                            {formatDate(document.createdAt)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(document.id)}
                                        disabled={deletingId === document.id}
                                        className="shrink-0 rounded-2xl bg-surface-alt px-4 py-2 text-sm font-semibold text-ink-sub hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                                    >
                                        {deletingId === document.id ? "삭제 중..." : "삭제"}
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

export default DocumentList;