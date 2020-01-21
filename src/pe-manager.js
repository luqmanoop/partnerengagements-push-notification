import axios from 'axios';
import cheerio from 'cheerio';

const engagementsUrl = 'https://boards.greenhouse.io/partnerengagementstaffing';

class ParternEngagementManager {
  openEngagements = [];

  async getOpenEngagements() {
    return axios(engagementsUrl).then(res => {
      const { status, data } = res;
      if (status !== 200) return;

      let $ = cheerio.load(data);
      let openEngagements = [];
      $('div.opening a').each(function() {
        let name = $(this).text();
        let link = $(this).attr('href');
        openEngagements.push({
          name,
          link
        });
      });

      this.openEngagements = openEngagements;
      return this.openEngagements;
    });
  }
}

export default new ParternEngagementManager()
