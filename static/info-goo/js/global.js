$(function (){
    // 移动端菜单交互
    const $mobileMenuBtn = $('.mobile-menu-btn');
    const $mobileNav = $('.mobile-nav');
    const $closeMenuBtn = $('.close-menu');
    const $mobileNavLinks = $('.mobile-nav a');
    const desktop_nav = $('.desktop-nav > ul');

    $mobileMenuBtn.on('click', function() {
        $mobileNav.addClass('active');
        $('.mobile-nav > ul').html(desktop_nav.html());
    });

    $closeMenuBtn.on('click', function() {
        $mobileNav.removeClass('active');
        $('.mobile-nav > ul').empty();
    });

    // 点击菜单项后关闭菜单
    $mobileNavLinks.on('click', function() {
        $mobileNav.removeClass('active');
        $('.mobile-nav > ul').empty();
    });

    // 分类按钮点击效果
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');

        var category_id = parseInt($(this).attr('data-category-id'));
        if(category_id === 0){
            $('.product-item').show();
        }else{
            $('.product-item').hide();
            $('.cid-'+ category_id).show();
        }
    });

    // 全局变量存储定时器ID
    let countdownInterval = null;

    // 数量选择器功能
    const $quantityInput = $('#quantity');
    const $subtractBtn = $('.quantity-btn.subtract');
    const $increaseBtn = $('.quantity-btn.increase');
    const $totalPriceElement = $('#totalPrice');
    const basePrice = parseFloat($totalPriceElement.attr('data-price'));

    function updateTotalPrice() {
        const quantity = parseInt($quantityInput.val());
        const totalPrice = (basePrice * quantity).toFixed(2);
        $totalPriceElement.text('$' + totalPrice);
    }

    $subtractBtn.click(function() {
        let currentValue = parseInt($quantityInput.val());
        if (currentValue > 1) {
            $quantityInput.val(currentValue - 1);
            updateTotalPrice();
        }
    });

    $increaseBtn.click(function() {
        let currentValue = parseInt($quantityInput.val());
        if (currentValue < 1000) {
            $quantityInput.val(currentValue + 1);
            updateTotalPrice();
        }
    });

    $quantityInput.on('input', function() {
        let value = parseInt($(this).val());
        if (value < 1) $(this).val(1);
        if (value > 1000) $(this).val(1000);
        updateTotalPrice();
    });

    // 支付方式选择
    $('.payment-method').click(function() {
        $('.payment-method').removeClass('selected');
        $(this).addClass('selected');
    });

    // 创建支付模态框函数
    function createPurchaseModal() {
        const modalHtml = `
                    <div class="modal-overlay" id="purchaseModal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3 class="modal-title"><i class="fas fa-file-invoice-dollar"></i> 订单信息</h3>
                                <button class="close-btn close-modal-btn"><i class="fa-solid fa-xmark"></i></button>
                            </div>

                            <div class="modal-body">
                                <div class="_order-info">
                                    <!-- 倒计时 -->
                                    <div class="countdown-section">
                                        <div class="countdown-title"><i class="fas fa-clock"></i> 请在规定时间内完成支付</div>
                                        <div class="countdown-timer" id="countdownTimer">15:00</div>
                                        <div class="countdown-hint">订单将在倒计时结束后自动取消</div>
                                    </div>

                                    <!-- 订单摘要 -->
                                    <div class="order-summary">
                                        <h4 class="summary-title"><i class="fas fa-clipboard-list"></i> 订单详情</h4>
                                        <div class="summary-row">
                                            <span class="summary-label">商品名称</span>
                                            <span class="summary-value" id="product_name">-</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">收件邮箱</span>
                                            <span class="summary-value" id="summaryEmail">-</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">购买数量</span>
                                            <span class="summary-value" id="summaryQuantity">0</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">单价</span>
                                            <span class="summary-value" id="summaryPrice">$0.00</span>
                                        </div>
                                        <div class="summary-row summary-row-clear-bt">
                                            <span class="summary-label">支付方式</span>
                                            <span class="summary-value" id="summaryPayment">-</span>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">应付总额</span>
                                            <span class="summary-value total" id="summaryTotal">-</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- 支付信息 -->
                                <div class="payment-section">
                                    <h4 class="payment-title"><i class="fas fa-money-bill-wave"></i> 支付信息</h4>
                                    <div class="address-section">
                                        <div class="address-label"><i class="fas fa-wallet"></i> 收款地址</div>
                                        <div class="address-value" id="usdtAddress"></div>
                                        <button class="copy-btn"><i class="far fa-copy"></i> 复制</button>
                                    </div>
                                    <div class="qr-section">
                                        <div class="qr-code" id="qr-code"><i class="fas fa-qrcode fa-3x"></i></div>
                                        <p style="color: #64748b; font-size: 14px;">请使用支持 <span>USDT-TRC20</span> 的钱包扫码支付</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               `;

        // 将模态框添加到页面
        $('body').append(modalHtml);

        // 绑定模态框事件
        bindModalEvents();
    }

    // 绑定模态框事件
    function bindModalEvents() {
        // 关闭模态框
        $('.close-modal-btn').click(function() {
            closeModal();
        });

        // 点击模态框外部关闭
        $('#purchaseModal').click(function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // 复制地址功能
        $('.copy-btn').click(function() {
            if(typeof ClipboardJS !== 'undefined'){
                var clipboard = new ClipboardJS('.copy-btn');
                copy_btn = $('.copy-btn');
                clipboard.on('success', function (e) {
                    copy_btn.html('<i class="fas fa-check"></i> 已复制');
                    copy_btn.addClass('copied');
                    setTimeout(function() {
                        copy_btn.html('<i class="far fa-copy"></i> 复制');
                        copy_btn.removeClass('copied');
                    }, 2000);
                    e.clearSelection();
                });
            }
        });
    }

    // 关闭模态框函数
    function closeModal() {
        // 清除定时器
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        // 隐藏模态框
        $('#purchaseModal').removeClass('active');
    }

    // 购买按钮点击事件
    $('#buyBtn').click(function() {
        const email = $('#email').val();
        const quantity = $('#quantity').val();
        const selectedPayment = $('.payment-method.selected .payment-text').text();

        if (!email) {
            alert('请输入邮箱地址');
            return;
        }

        // 如果模态框不存在，先创建它
        if ($('#purchaseModal').length === 0) {
            createPurchaseModal();
        }

        // 更新模态框中的信息
        $('#product_name').text($('.product-d-title').text());
        $('#summaryEmail').text(email);
        $('#summaryQuantity').text(quantity);
        $('#summaryPrice').text('$' + basePrice.toFixed(2));
        $('#summaryPayment').text(selectedPayment);
        $('#summaryTotal').text('$' + (basePrice * quantity).toFixed(2));

        const _addr = [
            ['USDT-TRC20', 'TSgdJAeWbLcVnGsdZvFNhuHXPMrBmS8LgW'],
            ['USDT-ERC20', '0x41AFA4C7bCe2B872dFD43E2e90CA7660DCBcc3e4'],
            ['USDT-BEP20', '0x41AFA4C7bCe2B872dFD43E2e90CA7660DCBcc3e4'],
            ['USDT-Solana', '9SkLafQAG2rbWkMamZQ6jwg1G79BLtUTTR3cHDwrvAzN']
        ];
        const found = _addr.find(item => item[0] === selectedPayment);
        $('#usdtAddress').text(found[1]);
        $('.qr-section span').text(selectedPayment);
        $('.copy-btn').attr('data-clipboard-text', found[1]);
        $('#qr-code').empty();

        const qrCode = new QRCodeStyling({
            width: 200,
            height: 200,
            type: "canvas",
            data: found[1],
            image: '/static/info-goo/img/'+ selectedPayment.toLowerCase() +'.png',
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: 0.3,
                hideBackgroundDots: true
            }
        });

        document.getElementById('qr-code').innerHTML = '';
        qrCode.append(document.getElementById("qr-code"));

        // 显示模态框
        $('#purchaseModal').addClass('active');

        // 开始倒计时
        startCountdown();
    });

    // 倒计时功能
    function startCountdown() {
        // 清除之前的定时器（如果有）
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        let timeLeft = 15 * 60; // 15分钟
        const $countdownTimer = $('#countdownTimer');

        // 重置倒计时显示
        $countdownTimer.text('15:00');
        $countdownTimer.removeClass('warning');

        countdownInterval = setInterval(function() {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
                $('#purchaseModal').removeClass('active');
                alert('支付时间已到，订单已取消');
                return;
            }

            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            $countdownTimer.text(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

            if (timeLeft <= 60) {
                $countdownTimer.addClass('warning');
            }

            timeLeft--;
        }, 1000);
    }
});