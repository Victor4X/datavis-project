var dropDowns = document.querySelectorAll('.inline-dropdown');

// Process dropdowns
dropDowns.forEach(function(dropdown) {
    var selections = dropdown.querySelector('.inline-selections');

    function openDropdown(){
        selections.classList.toggle('open');
    }
    dropdown.addEventListener('click', openDropdown, false);

    var options = selections.querySelectorAll('.inline-selection');
    options.forEach(function(option) {
        option.addEventListener('click', function() {
            var selected = dropdown.querySelector('.inline-selected');
            if (selected.innerHTML !== option.innerHTML) {
                selected.innerHTML = option.innerHTML;
            }
        }, false);
    });
});