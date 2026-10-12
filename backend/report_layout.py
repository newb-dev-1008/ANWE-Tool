"""Reusable PDF typography, tables, links and geographic/evidence charts."""
from html import escape
from pathlib import Path as FilePath
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Path, String, Rect, Line

TEAL=colors.HexColor('#17554D');RUST=colors.HexColor('#A44E30');PALE=colors.HexColor('#EDF5F2');INK=colors.HexColor('#243B3B')
WIDTH=A4[0]-36*mm
FONT='Helvetica';BOLD='Helvetica-Bold'
for regular,bold in [('C:/Windows/Fonts/arial.ttf','C:/Windows/Fonts/arialbd.ttf'),('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf','/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')]:
    if FilePath(regular).exists() and FilePath(bold).exists():
        if 'ANWE' not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont('ANWE',regular));pdfmetrics.registerFont(TTFont('ANWE-Bold',bold))
        FONT='ANWE';BOLD='ANWE-Bold';break

class ReportDocument(SimpleDocTemplate):
    def afterFlowable(self,flowable):
        if hasattr(flowable,'report_bookmark'):
            key,title=flowable.report_bookmark
            self.canv.bookmarkPage(key);self.canv.addOutlineEntry(title,key,level=0,closed=False)

class Layout:
    def __init__(self):
        self.story=[];self.bookmark=0
        self.styles={
            'body':ParagraphStyle('Body',fontName=FONT,fontSize=10,leading=14.5,textColor=INK,spaceAfter=7),
            'cell':ParagraphStyle('Cell',fontName=FONT,fontSize=9.3,leading=12.5,textColor=INK,spaceAfter=0,wordWrap='CJK'),
            'small':ParagraphStyle('Small',fontName=FONT,fontSize=8.7,leading=12,textColor=INK,spaceAfter=6,wordWrap='CJK'),
            'title':ParagraphStyle('Title',fontName=BOLD,fontSize=25,leading=30,textColor=TEAL,spaceAfter=10,keepWithNext=True),
            'h1':ParagraphStyle('Section',fontName=BOLD,fontSize=19,leading=24,textColor=TEAL,spaceAfter=12,keepWithNext=True),
            'h2':ParagraphStyle('Sub',fontName=BOLD,fontSize=12,leading=16,textColor=TEAL,spaceBefore=8,spaceAfter=5,keepWithNext=True)}
    def p(self,text,style='body',raw=False):
        content=str(text)
        content=content.replace('\u2014',' - ').replace('\u00b7',' / ').replace('\u00a9','(c)').replace('\u2026','...')
        if FONT=='Helvetica':content=content.replace('→',' > ').replace('−','-').replace('…','...')
        return Paragraph(content if raw else escape(content).replace('\n','<br/>'),self.styles[style])
    def add(self,text,style='body'):self.story.append(self.p(text,style))
    def heading(self,title,new_page=True):
        title=title.replace('\u2014','-')
        if new_page:self.story.append(PageBreak())
        self.bookmark+=1;p=self.p(title,'h1');p.report_bookmark=('section-'+str(self.bookmark),title);self.story.append(p)
    def sub(self,title):self.add(title,'h2')
    def bullets(self,items):
        for item in items:self.add('• '+str(item))
    def note(self,title,text):
        self.story.append(KeepTogether([self.p(title,'h2'),self.p(text)]))
    def table(self,headers,rows,widths=None,small=False,caption=None):
        style='small' if small else 'cell'
        data=[[self.p(h,style) for h in headers]]+[[x if isinstance(x,Paragraph) else self.p(x,style) for x in row] for row in rows]
        if caption:data.insert(0,[self.p(caption,'h2')]+['']*(len(headers)-1))
        header_rows=2 if caption else 1
        table=Table(data,colWidths=widths or [WIDTH/len(headers)]*len(headers),repeatRows=header_rows,hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),PALE),('VALIGN',(0,0),(-1,-1),'TOP'),
          ('BOX',(0,0),(-1,-1),.4,colors.HexColor('#CCDDD6')),('INNERGRID',(0,0),(-1,-1),.25,colors.HexColor('#D7E3DE')),
          ('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))
        if caption:table.setStyle(TableStyle([('SPAN',(0,0),(-1,0)),('BACKGROUND',(0,1),(-1,1),PALE)]))
        self.story.extend([table,Spacer(1,9)])
    def link(self,url,label=None):
        if not isinstance(url,str) or not url.startswith('https://'):return self.p(label or url,'small')
        return self.p(f'<link href="{escape(url,quote=True)}" color="#17554D">{escape(label or url)}</link>','small',raw=True)
    def build(self,buffer):
        def footer(canvas,doc):
            canvas.saveState();canvas.setFont(FONT,8);canvas.setFillColor(TEAL)
            canvas.drawString(18*mm,12*mm,'ANWE 4.1 / Design for Values / No action authorised')
            canvas.drawRightString(A4[0]-18*mm,12*mm,f'Page {doc.page}');canvas.restoreState()
        doc=ReportDocument(buffer,pagesize=A4,leftMargin=18*mm,rightMargin=18*mm,topMargin=17*mm,bottomMargin=22*mm,
                           title='ANWE — Design for Values Assessment',author='ANWE')
        doc.build(self.story,onFirstPage=footer,onLaterPages=footer)

def study_map():
    from .comparison import perimeter
    geom=perimeter().simplify(120,preserve_topology=True)
    west,south,east,north=geom.bounds;w,h=WIDTH,180
    drawing=Drawing(w,h);drawing.add(Rect(0,0,w,h,fillColor=PALE,strokeColor=colors.HexColor('#D0DDD7')))
    scale=min((w-70)/(east-west),(h-60)/(north-south))
    for polygon in ([geom] if geom.geom_type=='Polygon' else geom.geoms):
        for ring in [polygon.exterior,*polygon.interiors]:
            path=Path(strokeColor=RUST,strokeWidth=.65,fillColor=None)
            for i,(x,y) in enumerate(ring.coords):
                px=(x-west)*scale+22;py=(y-south)*scale+36
                (path.moveTo if i==0 else path.lineTo)(px,py)
            path.closePath();drawing.add(path)
    drawing.add(String(w-27,h-22,'N',fontName=FONT,fontSize=10,fillColor=TEAL));drawing.add(Line(w-24,h-46,w-24,h-28,strokeColor=TEAL))
    length=5000*scale;drawing.add(Line(22,14,22+length,14,strokeWidth=2,strokeColor=INK))
    drawing.add(String(22,23,'5 km (UTM grid)',fontName=FONT,fontSize=8,fillColor=INK))
    drawing.add(Line(w-145,14,w-130,14,strokeColor=RUST,strokeWidth=1.4));drawing.add(String(w-125,10,'Mapped burned outline',fontName=FONT,fontSize=8,fillColor=INK))
    return drawing

def occurrence_chart(comparison):
    d=Drawing(WIDTH,185);maximum=max(1,*[comparison[phase]['zones'][z]['records'] for phase in ['before','after'] for z in ['burned','buffer','uncertain']])
    plot=WIDTH-220
    for x,color,label in [(0,TEAL,'Before'),(WIDTH/2,RUST,'After-start')]:
        d.add(Rect(x,171,12,8,fillColor=color,strokeColor=None));d.add(String(x+18,171,label,fontName=FONT,fontSize=9,fillColor=INK))
        phase='before' if label=='Before' else 'after'
        p=comparison['parameters']
        d.add(String(x,157,p[phase+'Start']+' to '+p[phase+'End'],fontName=FONT,fontSize=8,fillColor=INK))
    for i,z in enumerate(['burned','buffer','uncertain']):
        y=143-i*48
        if z=='uncertain':d.add(Line(0,y+21,WIDTH,y+21,strokeColor=colors.HexColor('#9CAFAB'),strokeDashArray=[3,3]))
        d.add(String(0,y,{'burned':'Inside fire footprint','buffer':'Nearby area','uncertain':'Uncertain location'}[z],fontName=FONT,fontSize=9,fillColor=INK))
        for phase,offset,color,label in [('before',0,TEAL,'Before'),('after',-17,RUST,'After')]:
            count=comparison[phase]['zones'][z]['records'];bar=count/maximum*plot
            d.add(String(130,y+offset,label,fontName=FONT,fontSize=8,fillColor=INK))
            if count:d.add(Rect(169,y+offset-2,bar,9,fillColor=color,strokeColor=None))
            d.add(String(WIDTH-35,y+offset,str(count),fontName=FONT,fontSize=9,fillColor=INK))
    d.add(String(169,7,'Record counts only — not numbers of animals',fontName=FONT,fontSize=8,fillColor=INK))
    return d
