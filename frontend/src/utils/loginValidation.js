export function validateUsername(username) {
    // Kiểm tra rỗng
    if (!username.trim()) {
        return 'Ten dang nhap khong duoc de trong';
    }
    // Kiểm tra độ dài username
    if (username.length < 3 || username.length > 50) {
        return 'Ten dang nhap phai co do dai tu 3-50 ky tu';
    }
    // Kiểm tra ký tự đặc biệt
    const kytuhople = /^[a-zA-Z0-9_ ]*$/;
    if (!kytuhople.test(username)) {
        return 'Username chi chua cac ky tu a-z, A-Z, 0-9 và "_"';
    }
    // Kiểm tra khoảng trống
    if (/\s/.test(username)) {
        return 'Username khong ton tai khoang trang';
    }
    // Đúng thì không trả về gì
    return '';

}
export function validatePassword(password) {
    // Kiểm tra password rỗng
    if (!password.trim()) {
        return 'Password khong duoc de trong';
    }
    // Kiểm tra độ dài password
    if (password.length < 6 || password.length > 100) {
        return 'Password co do dai tu 6-100 ky tu';
    }
    // Kiểm tra khoảng trống
    if (/\s/.test(password)) {
        return 'Password khong ton tai khoang trang';
    }
    // Kiểm tra định dạng password
    const passwordhople = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=`~]).+$/;
    if (!passwordhople.test(password)) {
        return 'Password khong dung dinh dang, phai co it nhat 1 chu cai hoa, ' +
            '1 chu cai thuong, 1 so, 1 ky tu dac biet'
    }
    // Đúng thì trả về ''
    return '';
}


// (?=.*[a-z]) → ít nhất 1 chữ thường
// (?=.*[A-Z]) → ít nhất 1 chữ hoa
// (?=.*\d) → ít nhất 1 số
// (?=.*[!@#$%^&*()_\-+=~])` → ít nhất 1 ký tự đặc biệt
// .+ → ít nhất 1 ký tự tổng thể