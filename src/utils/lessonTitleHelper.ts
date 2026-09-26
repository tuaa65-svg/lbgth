/**
 * Utility to clean lesson titles for Lesson Plans (KHBD), Schedule View (LBG), and Word Export:
 * - Bỏ không cần ghi lớp mấy (loại bỏ "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5", "Khối 1-5"...)
 * - Bỏ từ "bài học" của mỗi tiết (loại bỏ tiền tố "Bài học: ", "BÀI HỌC: ", cụm "Bài học")
 * - Tên tựa bỏ chữ môn chỉ ghi trọn vẹn tên bài học (loại bỏ "Môn: Tiếng Việt - ", "MÔN TOÁN: ",...)
 */
export function cleanLessonTitle(title: string | undefined | null): string {
  if (!title) return "";
  let res = title;

  // 0. Bỏ tiền tố môn học nếu có: "Môn: ... -", "MÔN: ...:", "Môn Tiếng Việt:"...
  res = res.replace(/^môn\s*[:\s-]*[a-zA-Zà-ỹÀ-Ỹ0-9\s&/-]+?[:–-]\s*/i, "");
  res = res.replace(/^môn\s*[:\s-]/i, "");

  // 1. Loại bỏ tiền tố hoặc cụm từ "Bài học:", "BÀI HỌC:", "Bài học -" hoặc "Bài học "
  res = res.replace(/^bài\s+học\s*[:–-]?\s*/i, "");
  res = res.replace(/\bbài\s+học\s*[:–-]?\s*/gi, "");
  res = res.replace(/\bbài\s+học\b/gi, "");

  // 2. Loại bỏ thông tin khối lớp (Lớp 1, Lớp 2, Lớp 3, Lớp 4, Lớp 5, Khối 1-5, Lớp 1A... Lớp 5E)
  res = res.replace(/\s*[-–:]\s*lớp\s*[1-5][A-Za-z]?\s*[-–:]\s*/gi, " - ");
  res = res.replace(/\s*[-–:]\s*lớp\s*[1-5][A-Za-z]?\b/gi, "");
  res = res.replace(/\blớp\s*[1-5][A-Za-z]?\s*[-–:]\s*/gi, "");
  res = res.replace(/\blớp\s*[1-5][A-Za-z]?\b/gi, "");

  res = res.replace(/\s*[-–:]\s*khối\s*[1-5]\s*[-–:]\s*/gi, " - ");
  res = res.replace(/\s*[-–:]\s*khối\s*[1-5]\b/gi, "");
  res = res.replace(/\bkhối\s*[1-5]\s*[-–:]\s*/gi, "");
  res = res.replace(/\bkhối\s*[1-5]\b/gi, "");

  // 3. Chuẩn hóa dấu phân cách và khoảng trắng thừa
  res = res.replace(/\s*-\s*-\s*/g, " - ");
  res = res.replace(/\s*:\s*:\s*/g, ": ");
  res = res.replace(/\s{2,}/g, " ").trim();
  res = res.replace(/^[-–:,\s]+/, "").replace(/[-–:,\s]+$/, "").trim();

  return res;
}

/**
 * Chuẩn hóa tên 4 hoạt động dạy học chủ yếu theo mẫu KHBD mới:
 * 1. Hoạt động mở đầu (thay cho Khởi động)
 * 2. Hoạt động hình thành kiến thức mới (thay cho Khám phá)
 * 3. Luyện tập / Thực hành (hoặc Luyện tập)
 * 4. Hoạt động vận dụng và trải nghiệm (thay cho Vận dụng)
 */
export function formatActivityName(name: string): string {
  if (!name) return "";
  let s = name.trim();

  // Đặc biệt: Hoạt động của tiết Sinh hoạt lớp (SHL)
  if (s.toLowerCase().includes("sơ kết") || s.toLowerCase().includes("sinh hoạt chủ đề") || s.toLowerCase().includes("phương hướng")) {
    if (s.startsWith("1.") || s.toLowerCase().includes("khởi động") || s.toLowerCase().includes("mở đầu")) {
      return "1. Hoạt động mở đầu (5 phút)";
    }
    if (s.startsWith("2.") || s.toLowerCase().includes("sơ kết")) {
      return "2. Sơ kết tuần qua (10-12 phút)";
    }
    if (s.startsWith("3.") || s.toLowerCase().includes("sinh hoạt chủ đề") || s.toLowerCase().includes("chủ điểm")) {
      return s.replace(/^3\.\s*[^:(]+/, "3. Sinh hoạt chủ đề");
    }
    if (s.startsWith("4.") || s.toLowerCase().includes("phương hướng") || s.toLowerCase().includes("vận dụng")) {
      return "4. Vận dụng & trải nghiệm (3-5 phút)";
    }
    return s;
  }

  // 1. Khởi động -> Hoạt động mở đầu
  if (s.toLowerCase().includes("khởi động") || s.toLowerCase().includes("mở đầu") || s.startsWith("1.")) {
    const timeMatch = s.match(/\(([^)]+phút[^)]*)\)/i);
    const timeStr = timeMatch ? ` (${timeMatch[1]})` : "";
    return `1. Hoạt động mở đầu${timeStr}`;
  }

  // 2. Khám phá -> Hình thành kiến thức mới
  if (s.toLowerCase().includes("khám phá") || s.toLowerCase().includes("hình thành kiến thức") || s.startsWith("2.")) {
    const timeMatch = s.match(/\(([^)]+phút[^)]*)\)/i);
    const timeStr = timeMatch ? ` (${timeMatch[1]})` : "";
    return `2. Hình thành kiến thức mới${timeStr}`;
  }

  // 3. Luyện tập / Thực hành -> Luyện tập, thực hành
  if (s.toLowerCase().includes("luyện tập") || s.toLowerCase().includes("thực hành") || s.startsWith("3.")) {
    const timeMatch = s.match(/\(([^)]+phút[^)]*)\)/i);
    const timeStr = timeMatch ? ` (${timeMatch[1]})` : "";
    return `3. Luyện tập, thực hành${timeStr}`;
  }

  // 4. Vận dụng -> Vận dụng & trải nghiệm
  if (s.toLowerCase().includes("vận dụng") || s.toLowerCase().includes("trải nghiệm") || s.toLowerCase().includes("mở rộng") || s.startsWith("4.")) {
    const timeMatch = s.match(/\(([^)]+phút[^)]*)\)/i);
    const timeStr = timeMatch ? ` (${timeMatch[1]})` : "";
    return `4. Vận dụng & trải nghiệm${timeStr}`;
  }

  return s;
}

