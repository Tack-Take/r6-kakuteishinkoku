document.addEventListener('DOMContentLoaded', function() {
    const progressBtns = document.querySelectorAll('.progress-btn');
    const stepContents = document.querySelectorAll('.step-content');
    const deductionCategories = document.querySelectorAll('.deduction-category');
    const deductionCheckboxes = document.querySelectorAll('.deduction-checkbox');
    const submissionCategories = document.querySelectorAll('.submission-category');
    const submissionRadios = document.querySelectorAll('.submission-radio');
    const prepCategories = document.querySelectorAll('.prep-category');
    const documentCategories = document.querySelectorAll('.document-category');
    
    // ステップナビゲーション
    progressBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const step = this.getAttribute('data-step');
            
            // アクティブなボタンとコンテンツを更新
            progressBtns.forEach(b => b.classList.remove('active'));
            stepContents.forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(step).classList.add('active');
        });
    });
    
    // アコーディオンカテゴリーヘッダー
    function setupAccordionHeaders(elements) {
        elements.forEach(element => {
            const header = element.querySelector('h3');
            if (header) {
                header.addEventListener('click', function() {
                    // トグル前の状態を保存
                    const wasActive = element.classList.contains('active');
                    
                    // 同じタイプの他のカテゴリーを閉じる（オプション）
                    const siblings = document.querySelectorAll(`.${element.classList[0]}`);
                    siblings.forEach(sib => {
                        if (sib !== element) {
                            sib.classList.remove('active');
                        }
                    });
                    
                    // クリックされた要素の状態を切り替え
                    if (wasActive) {
                        element.classList.remove('active');
                    } else {
                        element.classList.add('active');
                    }
                });
            }
        });
    }
    
    // 各カテゴリータイプに対してセットアップ
    setupAccordionHeaders(deductionCategories);
    setupAccordionHeaders(submissionCategories);
    setupAccordionHeaders(documentCategories);
    setupAccordionHeaders(prepCategories);
    
    // 初期化時にすべてのprep-categoryとdocument-categoryに対してactiveクラスを削除
    prepCategories.forEach(category => {
        category.classList.remove('active');
    });
    
    documentCategories.forEach(category => {
        category.classList.remove('active');
    });
    
    // アコーディオンヘッダー
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const parent = this.parentElement;
            const content = this.nextElementSibling;
            
            // 同じアコーディオン内の他の項目を閉じる
            const accordion = parent.parentElement;
            const siblings = accordion.querySelectorAll('.accordion-item');
            
            siblings.forEach(sibling => {
                if (sibling !== parent) {
                    sibling.classList.remove('active');
                    const siblingContent = sibling.querySelector('.accordion-content');
                    siblingContent.classList.remove('active');
                }
            });
            
            // クリックされた項目の状態を切り替える
            parent.classList.toggle('active');
            content.classList.toggle('active');
        });
    });
    
    // 控除項目の選択
    deductionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.getAttribute('data-category');
            const targetCategory = document.querySelector(`.deduction-category[data-category="${category}"]`);
            
            if (this.checked) {
                targetCategory.classList.add('active');
            } else {
                targetCategory.classList.remove('active');
            }
        });
    });
    
    // 申告方法の選択
    submissionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const method = this.getAttribute('data-method');
            
            submissionCategories.forEach(category => {
                category.classList.remove('active');
            });
            
            if (method) {
                const targetCategory = document.querySelector(`.submission-category[data-method="${method}"]`);
                if (targetCategory) {
                    targetCategory.classList.add('active');
                }
            }
        });
    });
    
    // 必要書類の表示
    function updateDocumentList() {
        const selectedDeductions = Array.from(deductionCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.getAttribute('data-category'));
        
        documentCategories.forEach(category => {
            const deductionType = category.getAttribute('data-deduction');
            
            if (deductionType && selectedDeductions.includes(deductionType)) {
                category.classList.add('active');
            } else if (deductionType) {
                category.classList.remove('active');
            }
        });
    }
    
    deductionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateDocumentList);
    });
    
    // 年末調整有無による表示切替
    const yearEndAdjustmentRadios = document.querySelectorAll('input[name="year-end-adjustment"]');
    yearEndAdjustmentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isAdjusted = document.getElementById('yes-adjustment').checked;
            const targetElements = document.querySelectorAll('.year-end-adjustment-dependent');
            
            targetElements.forEach(element => {
                if (isAdjusted) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            });
        });
    });
    
    // 初期状態でアクティブなステップを設定
    const initialStep = document.querySelector('.progress-btn[data-step="preparation"]');
    if (initialStep) {
        initialStep.click();
    }

    // チェックリストの保存機能
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    // 保存されたチェック状態を復元
    checklistItems.forEach(item => {
        const savedState = localStorage.getItem(item.id);
        if (savedState === 'true') {
            item.checked = true;
            updateChecklistItemStyle(item);
        }
    });

    // チェック状態を保存
    checklistItems.forEach(item => {
        item.addEventListener('change', () => {
            localStorage.setItem(item.id, item.checked);
            updateChecklistItemStyle(item);
        });
    });

    // チェックリストアイテムのスタイル更新
    function updateChecklistItemStyle(checkbox) {
        const label = checkbox.nextElementSibling;
        const container = checkbox.closest('.checklist-item');

        if (checkbox.checked) {
            label.style.color = 'var(--success-color)';
            label.style.textDecoration = 'line-through';
            container.style.backgroundColor = '#f0fff4';
        } else {
            label.style.color = 'var(--text-color)';
            label.style.textDecoration = 'none';
            container.style.backgroundColor = 'var(--background-color)';
        }
    }

    // 進捗状況の表示
    function updateProgress() {
        const totalItems = checklistItems.length;
        const checkedItems = Array.from(checklistItems).filter(item => item.checked).length;
        const progressPercentage = (checkedItems / totalItems) * 100;

        // 進捗状況をローカルストレージに保存
        localStorage.setItem('preparationProgress', progressPercentage);
    }

    // チェックボックスの変更時に進捗状況を更新
    checklistItems.forEach(item => {
        item.addEventListener('change', updateProgress);
    });

    // ページ読み込み時に進捗状況を更新
    updateProgress();
}); 