const https = require('https');

// Hàm hỗ trợ gửi HTTP request
function makeRequest(url, method = 'GET', data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseData);
                    resolve(parsedData);
                } catch (error) {
                    resolve(responseData);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Lấy dữ liệu đầu vào từ API
async function getInput() {
    try {
        const response = await makeRequest('https://share.shub.edu.vn/api/intern-test/input');
        console.log('Nhận input:', response);
        return response;
    } catch (error) {
        console.error('Lỗi lấy input:', error);
        throw error;
    }
}

// Gửi kết quả về API
async function sendOutput(token, result) {
    try {
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        const response = await makeRequest(
            'https://share.shub.edu.vn/api/intern-test/output',
            'POST',
            result,
            headers
        );
        
        console.log('Gửi output thành công:', response);
        return response;
    } catch (error) {
        console.error('Lỗi gửi output:', error);
        throw error;
    }
}

// Tạo prefix arrays cho range queries
function createPrefixSums(data) {
    const n = data.length;
    const prefixSum = new Array(n);    // Tổng tích lũy thường
    const prefixAlt = new Array(n);    // Tổng tích lũy xen kẽ
    
    prefixSum[0] = data[0];
    prefixAlt[0] = data[0];
    
    // Xây dựng prefixSum: prefixSum[i] = sum(data[0..i])
    for (let i = 1; i < n; i++) {
        prefixSum[i] = prefixSum[i - 1] + data[i];
    }
    
    // Xây dựng prefixAlt: xen kẽ + và -
    for (let i = 1; i < n; i++) {
        if (i % 2 === 0) {
            prefixAlt[i] = prefixAlt[i - 1] + data[i];  // Chẵn: cộng
        } else {
            prefixAlt[i] = prefixAlt[i - 1] - data[i];  // Lẻ: trừ
        }
    }
    
    return { prefixSum, prefixAlt };
}

// Tính tổng đoạn [l, r] - Type 1
function calculateRangeSum(prefixSum, l, r) {
    if (l === 0) return prefixSum[r];
    return prefixSum[r] - prefixSum[l - 1];  // sum(l,r) = sum(0,r) - sum(0,l-1)
}

// Tính tổng xen kẽ đoạn [l, r] - Type 2
function calculateAlternatingSum(prefixAlt, l, r) {
    let result = (l === 0) ? prefixAlt[r] : prefixAlt[r] - prefixAlt[l - 1];
    
    // Đổi dấu nếu l lẻ (pattern xen kẽ bị lệch)
    if (l % 2 === 1) result = -result;
    
    return result;
}

// Xử lý tất cả truy vấn - O(n + q)
function processQueries(data, queries) {
    const { prefixSum, prefixAlt } = createPrefixSums(data);  // O(n)
    const results = [];
    
    for (const query of queries) {  // O(q)
        const { type, range } = query;
        const [l, r] = range;
        
        if (type === "1") {
            results.push(calculateRangeSum(prefixSum, l, r));
        } else if (type === "2") {
            results.push(calculateAlternatingSum(prefixAlt, l, r));
        }
    }
    
    return results;
}

// Main function
async function solve() {
    try {
        console.log('Bắt đầu xử lý...');
        
        const input = await getInput();
        const { token, data, query } = input;
        
        console.log(`Xử lý ${data.length} phần tử, ${query.length} truy vấn`);
        
        const result = processQueries(data, query);
        await sendOutput(token, result);
        
        console.log('Hoàn thành!');
        
    } catch (error) {
        console.error('Lỗi:', error);
    }
}

// Run the solution
if (require.main === module) {
    solve();
}

module.exports = {
    solve,
    processQueries,
    createPrefixSums,
    calculateRangeSum,
    calculateAlternatingSum
};
