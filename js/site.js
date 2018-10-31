$(function() {

    // var AC_EMBED_URL = 'http://metacube:9000/embed/';
    var AC_EMBED_URL = 'https://anticensorship.herokuapp.com/embed/';
    var original_html = $('#all_code').val();

    _ac_index = original_html.indexOf('var _ac_hosts');

    // fix stupid firefox problem
    if (_ac_index != -1) {
        setTimeout(function() {
            begin = original_html.indexOf('window._idl') - 1;
            o = '<script type="text/javascript">' + original_html.substr(begin);
            original_html = o;
            $('#all_code').val(o);
        }, 100);
    }

    var switch_censorship = function() {
        $('#all_code').val(original_html);

        if(!$("#anticensorship").is(':checked'))
            return;
        
        $.ajax({url: AC_EMBED_URL, dataType: 'text', success: function(result) {
            console.log('result: ', result);

            var val = $('#all_code').val();
            var end = val.indexOf("script type=\"text/javascript\">") + 31;

            var val = val.substr(0, end) + result + '\r\n' + val.substr(end);
            $('#all_code').val(val);

        }});
    }

    $('#all').click(function() {
        $('#all_select').addClass('indented').addClass('light');
        $('#single_select').removeClass('indented').removeClass('light');
        $('#all_code').show();
        $('#single_code').hide();
    });

    $('#single').click(function() {
        $('#single_select').addClass('indented').addClass('light');
        $('#all_select').removeClass('indented').removeClass('light');
        $('#all_code').hide();
        $('#single_code').show();
    });

    $('#subscribe').submit(function(e) {
        e.preventDefault();
        var tag = 'internet-defense-league';

        if($("#anticensorship").is(':checked'))
            tag = 'anti-censorship-network';

        var data = new FormData();
        data.append('guard', '');
        data.append('hp_enabled', true);
        data.append('member[email]', document.getElementById('email').value);
        data.append('tag', tag);

        var url = 'https://queue.fightforthefuture.org/action';

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('response:', xhr.response);
            }
        }.bind(this);
        xhr.open("post", url, true);
        xhr.send(data);
        $('#form_elements')[0].style.opacity = 0;
        $('#form_thanks')[0].style.display = 'block';
        setTimeout(function() {
            $('#form_thanks')[0].style.opacity = 1;
        }, 50);
    });

    $('#anticensorship').change(switch_censorship);
    switch_censorship();

    $("#all_code").focus(function() {
        var $this = $(this);
        $this.select();
        $('#subscribe').slideDown();

        // Work around Chrome's little problem
        $this.mouseup(function() {
            // Prevent further mouseup intervention
            $this.unbind("mouseup");
            return false;
        });
    });

});