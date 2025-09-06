# coding=utf-8
""" make_js_index.py for nirukta
"""
from __future__ import print_function
import sys, re, codecs
import json

def int_to_roman(n):
    val_map = [
        (1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
        (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
        (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')
    ]
    
    roman_numeral = ''
    for value, numeral in val_map:
        while n >= value:
            roman_numeral += numeral
            n -= value
            
    return roman_numeral

# Example usage:
#num = int(input("Enter a positive integer: "))
#print(f"Roman numeral: {int_to_roman(num)}")

def roman_to_int(roman):
 droman_int = {'I':1, 'II':2, 'III':3, 'IV':4,
                'V':5, 'VI':6, 'VII':7, 'VIII':8, 'IX':9,
                'X':10, 'XI':11, 'XII':12,'':0}
 if roman in droman_int:
  return droman_int[roman]
 else:
  # error condition
  return None

def make_js(recs):
 outarr = []
 outarr.append('indexdata = [')
 arr = [] # array of Python dicts
 for rec in recs:
  d = rec.todict()  # a Python dictionary
  arr.append(d)
 return arr

def write_recs(fileout,data):
 with codecs.open(fileout,"w","utf-8") as f:
  f.write('indexdata = \n')
  jsonstring = json.dumps(data,indent=1)
  f.write( jsonstring +  '\n')
  f.write('; // end of indexdata\n')
  
 print('%s json records written to %s' %(len(data),fileout))

class PagerecsPreface:
 def __init__(self,epage,rpref,title):
  self.page = int(epage)
  self.ipage = rpref  # a string
  self.title = title 
  self.vpstr = '%03d' % epage
 def todict(self):
  e = {
   'page':int(self.page),
   'title':self.title,
   'ipage':self.ipage,
   'vp':self.vpstr
  }
  return e
  
def init_pagerecs_preface():
 recs = []
 # title page
 rec = PagerecsPreface(6,'title','title page')
 recs.append(rec)
 ipref = 0  
 for epage in range(8,79+1):
  ipref = ipref + 1
  rpref = int_to_roman(ipref)
  rpref = rpref.lower()
  ipage = rpref
  title = 'front matter %s' % rpref
  rec = PagerecsPreface(epage,rpref,title)
  recs.append(rec)
 return recs

def init_pagerecs_main():
 recs = []
 #1 = 80
 for epage in range(80,279 + 1):
  ipage = epage - 79
  title = 'Page %s' % ipage
  rec = PagerecsPreface(epage,ipage,title)
  recs.append(rec)
 return recs

def init_pagerecs_latina():
 recs = []
 for epage in range(112,165+1):
  ipage = epage - 37
  title = 'interpretatio latina %s' % ipage
  rec = PagerecsPreface(epage,ipage,title)
  recs.append(rec)
 return recs

def init_pagerecs_commentarius():
 recs = []
 for epage in range(166,285+1):
  ipage = epage - 37
  title = 'commentarius %s' % ipage
  rec = PagerecsPreface(epage,ipage,title)
  recs.append(rec)
 return recs

def init_pagerecs_addenda():
 recs = []
 for epage in range(286,287+1):
  ipage = epage - 37
  title = 'addenda et corrigenda %s' % ipage
  rec = PagerecsPreface(epage,ipage,title)
  recs.append(rec)
 return recs


if __name__ == "__main__":
 fileout = sys.argv[1]  # index.js
 filevol = None

 # preface
 pagerecs_preface = init_pagerecs_preface()
 outrecs_preface  = make_js(pagerecs_preface)
 # main
 pagerecs_main = init_pagerecs_main()
 outrecs_main = make_js(pagerecs_main)

 outrecs = (outrecs_preface + outrecs_main)
 write_recs(fileout,outrecs)

"""
epage 280-307 (ipage 201-228)
       Nachweisung der im Nirukta angefuhrten wedischen Stellen
       Evidence of the Vedic passages cited in the Nirukta
epage 308-537 (ipage restarts at 1) (ipage 1-230)
             Erluterungen zum Nirukta
            Explanations of Nirukta
"""
