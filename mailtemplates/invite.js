const mjml2html = require('mjml');

module.exports = {
  htmlTemplate: (id) => {
    const htmlOutput = mjml2html(`
<mjml>
<mj-head>
  <mj-title></mj-title>
  <mj-preview></mj-preview>
  <mj-attributes>
    <mj-all font-family="'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-all>
    <mj-text font-weight="400" font-size="16px" color="#000000" line-height="24px" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"></mj-text>
  </mj-attributes>
  <mj-style inline="inline">
    .body-section { -webkit-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); -moz-box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); box-shadow: 1px 4px 11px 0px rgba(0, 0, 0, 0.15); }
  </mj-style>
  <mj-style inline="inline">
    .text-link { color: #5e6ebf }
  </mj-style>
  <mj-style inline="inline">
    .footer-link { color: #888888 }
  </mj-style>

</mj-head>
<mj-body background-color="#EAEEFF" width="600px"
  <mj-section background-color="#2E4357">
    <mj-column width="100%">
    </mj-column>
  </mj-section>
  <mj-wrapper padding-top="0" padding-bottom="0" css-class="body-section">
    <mj-section background-color="#ffffff" padding-left="15px" padding-right="15px" padding-top="40" padding-bottom="40">
      <mj-column width="100%">
        <mj-text>You are invited to join our plattform:<br><br><a href="${process.env.APP_URL}/confirmInvitation/${id}">Join</a></mj-text>
      </mj-column>
    </mj-section>
  </mj-wrapper>
</mj-body>
</mjml>
`);
    return htmlOutput.html;
  }
}