document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const nixieClock = document.getElementById('nixieClock');

    // 点击按钮时切换侧边栏的隐藏/显示状态
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        
        // 通知 iframe 调整尺寸
        setTimeout(() => {
            const iframe = document.querySelector('iframe[src="/cris.html"]');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'resize' }, '*');
            }
        }, 400); // 等待侧边栏动画完成
    });

    // 页面加载时检查 sessionStorage 以决定侧边栏状态
    if (window.innerWidth <= 768 && sessionStorage.getItem('hideSidebarOnMobile') === 'true') {
        sidebar.classList.add('hidden');
        // 重置标记，避免本次会话中后续访问也隐藏
        sessionStorage.removeItem('hideSidebarOnMobile');
    }

    // 辉光管时钟功能
    function updateNixieClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const timeString = hours + minutes + seconds;

        // 获取所有数字管 (排除冒号)
        const tubes = nixieClock.querySelectorAll('.nixie-tube:not(.colon)');

        // 更新每个数字管
        for (let i = 0; i < tubes.length; i++) {
            const tube = tubes[i];
            const digit = timeString[i];

            // 移除所有active类
            tube.querySelectorAll('.nixie-digit').forEach(d => d.classList.remove('active'));

            // 为当前数字添加active类
            if (digit !== undefined) {
                tube.querySelector(`.nixie-digit:nth-child(${parseInt(digit) + 1})`).classList.add('active');
            }
        }
    }

    // 每秒更新一次时钟
    setInterval(updateNixieClock, 1000);
    updateNixieClock(); // 立即执行一次

    // 添加页面切换动画
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果是外部链接或锚点链接，则不执行动画
            if (this.hostname !== window.location.hostname || this.getAttribute('href').startsWith('#')) {
                return;
            }

            e.preventDefault();
            const href = this.getAttribute('href');

            // 检查屏幕宽度，如果是移动端，则在 sessionStorage 中设置标记
            if (window.innerWidth <= 768) {
                sessionStorage.setItem('hideSidebarOnMobile', 'true');
            }

            setTimeout(() => {
                window.location.href = href;
            }, 300);
        });
    });
});
// 思考条目折叠功能
document.addEventListener('DOMContentLoaded', function() {
    const thoughtEntries = document.querySelectorAll('.thought-entry');
    thoughtEntries.forEach(entry => {

        // 点击预览内容展开内容
        entry.querySelector('.preview-content').addEventListener('click', function() {
            // 如果当前已经展开，则不执行任何操作
            if (entry.classList.contains('expanded')) {
                return;
            }

            // 先折叠所有其他条目
            thoughtEntries.forEach(otherEntry => {
                if (otherEntry !== entry) {
                    otherEntry.classList.remove('expanded');
                }
            });

            // 展开当前条目
            entry.classList.add('expanded');
        });

        // 点击收起按钮折叠内容
        const collapseBtn = entry.querySelector('.collapse-btn');
        if (collapseBtn) {
            collapseBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止事件冒泡
                entry.classList.remove('expanded');
            });
        }
    });
});
