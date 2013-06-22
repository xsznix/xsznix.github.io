#!/usr/bin/env perl

open MYCSV, '<integrated_chinese.csv' or die 'Could not open file for parsing.';
open LEX, '+>lexicon.elex' or die 'Could not open file to write to.';

while (<MYCSV>) {
	my @cols = split ',', $_;
	my @defs = grep /\S/, split '/', $cols[5];
	print LEX $cols[0] . "\t" . join("\t", @defs) . "\n";
}