var header =
  '<header class="header">\
    <ul class="nav nav-pills pull-right">\
      <li class="dropdown">\
        <a class="dropdown-toggle" role="button" data-toggle="dropdown" href="#">サイトジャンプ</a>\
        <ul class="dropdown-menu" role="menu">\
          <li><a href="{0}">トップ</a></li>\
          <li class="divider"></li>\
          <li><a href="{0}etc/">全般</a></li>\
          <li><a href="{0}lury/">Lury</a></li>\
          <li><a href="{0}lab/">研究</a></li>\
          <li><a href="{0}fm/">FM音源</a></li>\
          <li><a href="{0}hugin/">このサイトのこと</a></li>\
        </ul>\
      </li>\
    </ul>\
    <h1 class="text-muted">Hugin</h1>\
    <hr />\
  </header>';

var footer =
  '<footer class="footer">\
    <hr />\
    <p>\
      <a href="{0}">トップ</a> --\
      <a href="{0}etc/">全般</a> -\
      <a href="{0}lury/">Lury</a> -\
      <a href="{0}lab/">研究</a> -\
      <a href="{0}fm/">FM音源</a> -\
      <a href="{0}hugin/">このサイトのこと</a>\
    </p>\
    <p>Copyright &copy; 2015 Tomona Nanase</p>\
  </footer>';

function _(format)
{
  var args = arguments;
  return format.replace(/\{(\d)\}/g, function(m, c) { return args[parseInt(c) + 1] });
}

function build_nav() {
  var nav = $('<nav class="affix-nav hidden-print hidden-xs"><ul class="nav"></ul></nav>');
  var navul = nav.children('ul.nav');

  $('.col-main>section').each(function() {
    var section = $('<li></li>').prepend(_('<a href="#{0}">{1}</a>', $(this).attr('id'), $(this).find(':header:first').text()));
    var subsection = $(_('.col-main section#{0} section', $(this).attr('id')));

    if (subsection.length > 0) {
      var subnavul = $('<ul class="nav"></ul>');
      subsection.each(function() {
        $('<li></li>').prepend(_('<a href="#{0}">{1}</a>', $(this).attr('id'), $(this).find(':header:first').text()))
                      .appendTo(subnavul);
      });
      subnavul.appendTo(section);
    }
    section.appendTo(navul);
  });

  nav.prependTo('.col-navigator');

  // apply affix
  $('nav.affix-nav').affix({
    offset: {
      top: $('.container>.row:first').position().top,
      bottom: 50
    }
  }).on('affix.bs.affix', function() {
    $(this).css('top', 0);
  });

  // apply scrollspy
  $('body').scrollspy({ target: 'nav.affix-nav' });
}

function build_regexLink() {
  var service = 'http://regexper.com/#';
  $('a[regex]').each(function() {
    $(this).attr('href', service + encodeURIComponent($(this).attr('regex')))
           .attr('target', '_blank');
  });
}

function build_grammarAnchor() {
  $('a.grammar').each(function() {
    $(this).attr('name', $(this).text());
  });
}

function build_parmaLink() {
  $(':header').each(function(){
    var id = $(this).parents('section:first').attr('id');

    if (typeof id === 'undefined')
      return;

    var parmalink = $(_('<a class="permalink" href="#{0}">§</a>', id));
    $(this).prepend(parmalink)
           .hover(function() { parmalink.css('opacity', 1); },
                  function() { parmalink.css('opacity', 0); });
  });
}

function place_markdownChar () {
  $('.bracket-left').text('[');
  $('.bracket-right').text(']');
  $('.backquote').text('`');
  $('.asterisk').text('*');
  $('.underline').text('_');
}

function moveToHash () {
  if (!location.hash || location.hash === '#')
    return;

  var p = $(location.hash).offset().top;
  $("html, body").animate({scrollTop: p}, 0);
}

$(function(){
  $('.container>.row:first').before(_(header, root_directory)).after(_(footer, root_directory));
  $(".markdown").markdown();

  $('<div class="col-navigator"></div>').insertAfter('.col-main');
  $('.col-main').addClass('col-sm-9');
  $('.col-navigator').addClass('col-sm-3');

  build_nav();
  build_regexLink();
  build_grammarAnchor();
  build_parmaLink();
  place_markdownChar();

  moveToHash();
});