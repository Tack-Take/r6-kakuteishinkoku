document.addEventListener('DOMContentLoaded', function() {
    // ナビゲーション切り替え
    const progressBtns = document.querySelectorAll('.progress-btn');
    const stepContents = document.querySelectorAll('.step-content');

    progressBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetStep = this.getAttribute('data-step');
            
            // すべてのボタンから active クラスを削除
            progressBtns.forEach(btn => btn.classList.remove('active'));
            // このボタンに active クラスを追加
            this.classList.add('active');
            
            // すべてのコンテンツから active クラスを削除
            stepContents.forEach(content => content.classList.remove('active'));
            // 対応するコンテンツに active クラスを追加
            document.getElementById(targetStep).classList.add('active');

            // 切り替え時に開いていたカテゴリーとアコーディオンをすべて閉じる
            const activeCategories = document.querySelectorAll('.deduction-category.active, .submission-category.active, .document-category.active, .prep-category.active');
            activeCategories.forEach(category => category.classList.remove('active'));
            
            const activeAccordions = document.querySelectorAll('.accordion-header.active');
            activeAccordions.forEach(accordion => {
                accordion.classList.remove('active');
                const content = accordion.nextElementSibling;
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                }
            });
        });
    });

    // カテゴリータイトルのクリックイベント
    const categoryTitles = document.querySelectorAll('.deduction-category h3, .submission-category h3, .document-category h3, .prep-category h3');
    categoryTitles.forEach(title => {
        title.addEventListener('click', function() {
            const parentCategory = this.parentElement;
            
            // 同じレベルのすべてのカテゴリーを閉じる（兄弟要素）
            const siblings = Array.from(parentCategory.parentElement.children).filter(child => 
                child !== parentCategory && 
                (child.classList.contains('deduction-category') || 
                child.classList.contains('submission-category') || 
                child.classList.contains('document-category') || 
                child.classList.contains('prep-category'))
            );
            
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // このカテゴリーのトグル
            parentCategory.classList.toggle('active');
            
            // カテゴリーを開いたとき、最初のアコーディオンを自動的に開く
            if (parentCategory.classList.contains('active')) {
                const firstAccordion = parentCategory.querySelector('.accordion-item:first-child .accordion-header');
                if (firstAccordion && !firstAccordion.classList.contains('active')) {
                    firstAccordion.click();
                }
            }
        });
    });

    // アコーディオンのクリックイベント
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            // 同じアコーディオングループ内の他の項目を閉じる
            const parentAccordion = this.closest('.accordion');
            const siblings = parentAccordion.querySelectorAll('.accordion-header.active');
            
            siblings.forEach(sibling => {
                if (sibling !== this) {
                    sibling.classList.remove('active');
                    const siblingContent = sibling.nextElementSibling;
                    siblingContent.classList.remove('active');
                }
            });
            
            // このアコーディオンのトグル
            this.classList.toggle('active');
            content.classList.toggle('active');
        });
    });

    // 初期表示
    document.querySelector('.progress-btn.active').click();

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