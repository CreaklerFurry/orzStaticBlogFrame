/// <reference path="./Utils/File.ts"/>
/// <reference path="./Utils/Log4ts.ts" />
/// <reference path="./Utils/LanguageEx.ts" />

const License = 'MIT License'
namespace orzBlogFrame {
  export const logger = new orzBlogFrame.Utils.Log4ts();
  export const langs = new orzBlogFrame.Utils.LanguageEx();
  export const file = new orzBlogFrame.Utils.File();
  export class orzProcessor {
    constructor() {
      this.load();
    };
    private async load() {
      logger.log('DEBUG', 'orzBlogFrame.<main>@orzProcseeor Init!');
      logger.log('DEBUG', 'OK! Waitting for user set the config.');
      logger.log('DEBUG', 'Languages:', await langs.getSupoortLang());
      langs.set(true);
    };

    public async init(config: {
      copyright?: string
      defaultTheme?: string
    }) {
      const frame = $('#orzFrame');
      const topbar = $('#orzTopbarRect', frame);
      const topbarMenu = $('#orzTopbarMenu', topbar);
      const contentRect = $('#orzContentRect', frame);
      const activityRect = $('#orzActivityRect', contentRect);
      const contentScroll = $('#orzContentScroll', contentRect);
      const articleContent = $('#orzArticleContent', contentRect);

      // init something
      (function initCookie() {
        if ($.cookie('orzContentScrollLeft') == undefined)
          $.cookie('orzContentScrollLeft', 170);
        if ($.cookie('orzCurrentTheme') == undefined)
          $.cookie('orzCurrentTheme', 'light');
      })();

      // config parse
      await (async function parseConfig() {
        const linkTheme = $('link[id="orzTheme"]');

        if (config.defaultTheme) {
          if (!await file.get(`/themes/${config.defaultTheme}/theme.css`))
            logger.log('ERROR', '[orzProcessor@parseConfig] defaultTheme isn\'t exist!\n');
          else {
            // use default
            $.cookie('orzCurrentTheme', config.defaultTheme);
            linkTheme.attr('href', `/themes/${config.defaultTheme}/theme.css`);
          };
        } else {
          // use last theme from cookie
          if ($.cookie('orzCurrentTheme') != 'light')
            linkTheme.attr('href', `/themes/${$.cookie('orzCurrentTheme')}/theme.css`);
        };
      })();

      // content scroll
      (function contentScrollbar() {
        // set default.
        const cookieScrollLeft = $.cookie('orzContentScrollLeft') as string;
        activityRect.width(Number(cookieScrollLeft) + 2 + 'px');
        contentScroll.css('left', `${cookieScrollLeft}px`);
        articleContent.css('left', `${cookieScrollLeft}px`);

        // move.
        contentScroll.on('mousedown', ev => {
          const body = $('body');

          body.on('mousemove.contentScrollbar', function (ev: JQuery.Event) {
            let step = (ev as unknown as MouseEvent).clientX;
            if (85 + 48 < step && step <= 170 + 48) step = 170 + 48;
            if (step <= 85 + 48) step = 48;

            activityRect.width(step);
            contentScroll.css('left', step - 2);
            articleContent.css('left', step - 2);
          });

          body.on('mouseup.contentScrollbar', function (ev: JQuery.Event) {
            $.cookie('orzContentScrollLeft', ev.clientX! - 2);
            body.off('mouseup.contentScrollbar');
            body.off('mousemove.contentScrollbar');
          });
        });

        // scroll bar hightlight.
        contentScroll.hoverIntent(
          () => {
            contentScroll.addClass('scrollbar-hover');
          },() => {
            // delay doesn't work!!!
            // contentScroll.delay(1250).removeClass('scrollbar-hover');
            contentScroll.removeClass('scrollbar-hover');
          }
        );
      })();

      // global document
      (function globalDocument () {
        frame.on('focus', () => {
          console.log('eee');
          
          topbar.removeClass('onTopbarBlur');
          topbarMenu.removeClass('onTopbarBlur');
        });
        frame.on('blur', () => {
          topbar.addClass('onTopbarBlur');
          topbarMenu.addClass('onTopbarBlur');
        });
      })();
    };
  };
};